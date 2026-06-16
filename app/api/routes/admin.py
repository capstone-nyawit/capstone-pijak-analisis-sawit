from fastapi import APIRouter, Depends, HTTPException, status
from app.api.routes.auth import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db.session import get_db
from app.models.user import User
from app.models.inference_log import InferenceLog
from app.models.vra_recommendation import VraRecommendation
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/system")
def get_admin_system_stats(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {
        "activeNodes": [
            { "node": 'Node-SEA-01', "load": '42%', "status": 'Online' },
            { "node": 'Node-SEA-02', "load": '18%', "status": 'Online' },
            { "node": 'Node-AUS-01', "load": '94%', "status": 'High Load' },
        ],
        "uptime": "99.99"
    }

@router.get("/reports/executive")
def get_executive_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    company_id = current_user.company_id

    total_analyses = db.query(InferenceLog).filter(InferenceLog.company_id == company_id).count()
    total_trees = db.query(func.sum(InferenceLog.trees_count)).filter(InferenceLog.company_id == company_id).scalar() or 0

    stats = db.query(
        func.sum(VraRecommendation.healthy_count).label("healthy"),
        func.sum(VraRecommendation.yellowing_count).label("yellowing"),
        func.sum(VraRecommendation.small_canopy_count).label("small_canopy"),
        func.sum(VraRecommendation.dead_count).label("dead")
    ).join(InferenceLog, VraRecommendation.inference_log_id == InferenceLog.id)\
     .filter(InferenceLog.company_id == company_id).first()

    healthy = int(stats.healthy or 0)
    yellowing = int(stats.yellowing or 0)
    small_canopy = int(stats.small_canopy or 0)
    dead = int(stats.dead or 0)

    total_rec_trees = healthy + yellowing + small_canopy + dead
    overall_health = (healthy / total_rec_trees * 100) if total_rec_trees > 0 else 0.0

    # 30-day Trend
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    trend_raw = db.query(
        func.date(InferenceLog.created_at).label("date"),
        func.sum(VraRecommendation.healthy_count).label("healthy"),
        func.sum(InferenceLog.trees_count).label("total")
    ).join(VraRecommendation, VraRecommendation.inference_log_id == InferenceLog.id)\
     .filter(InferenceLog.company_id == company_id)\
     .filter(InferenceLog.created_at >= thirty_days_ago)\
     .group_by(func.date(InferenceLog.created_at))\
     .order_by("date")\
     .all()

    trend_dict = {}
    for t in trend_raw:
        d_str = str(t.date)
        trend_dict[d_str] = (t.healthy / t.total * 100) if t.total else 0.0

    trend_points = []
    current_date = datetime.utcnow() - timedelta(days=30)
    last_known_score = overall_health if overall_health > 0 else 85.0

    for i in range(31):
        date_str = current_date.strftime("%Y-%m-%d")
        if date_str in trend_dict:
            last_known_score = trend_dict[date_str]
        trend_points.append({
            "date": current_date.strftime("%b %d"),
            "healthScore": round(last_known_score, 1)
        })
        current_date += timedelta(days=1)

    # Fetch all zones to perform python de-duplication, sorting, and mapping
    all_logs = db.query(
        InferenceLog.block_name,
        VraRecommendation.overall_priority,
        VraRecommendation.healthy_count,
        VraRecommendation.yellowing_count,
        VraRecommendation.small_canopy_count,
        VraRecommendation.dead_count,
        InferenceLog.trees_count,
        VraRecommendation.recommended_programs
    ).join(VraRecommendation, VraRecommendation.inference_log_id == InferenceLog.id)\
     .filter(InferenceLog.company_id == company_id)\
     .order_by(InferenceLog.created_at.desc()).all()

    # Case-insensitive grouping
    zone_groups = {}
    for row in all_logs:
        name = row.block_name.strip()
        key = name.lower()
        if key not in zone_groups:
            zone_groups[key] = []
        zone_groups[key].append(row)

    deduplicated_zones = []
    for key, rows in zone_groups.items():
        seen_data = set()
        group_rows = []
        for r in rows:
            # fingerprint contains stats
            data_fingerprint = (r.healthy_count, r.yellowing_count, r.small_canopy_count, r.dead_count, r.trees_count)
            if data_fingerprint not in seen_data:
                seen_data.add(data_fingerprint)
                group_rows.append(r)
        
        # Determine title-cased base name
        base_name = ' '.join(w.capitalize() for w in rows[0].block_name.split())

        # If multiple rows remain, disambiguate them
        if len(group_rows) > 1:
            alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            for idx, r in enumerate(group_rows):
                suffix = f"Block {alphabet[idx % 26]}"
                deduplicated_zones.append((r, f"{base_name} ({suffix})"))
        else:
            for r in group_rows:
                deduplicated_zones.append((r, base_name))

    priority_weights = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
    priority_zones = []
    
    for r, display_name in deduplicated_zones:
        anomalies = r.dead_count + r.yellowing_count + r.small_canopy_count
        pct_affected = (anomalies / r.trees_count * 100) if r.trees_count else 0.0

        prio = r.overall_priority
        if r.dead_count >= 4:
            prio = "Critical"
        elif r.dead_count >= 3:
            prio = "High"
        elif r.small_canopy_count > 200 or r.yellowing_count > 20:
            prio = "Medium"
        else:
            prio = "Low"

        # short recommended action max 4 words
        if prio == "Critical":
            rec = "Replanting Assessment"
        elif prio == "High":
            rec = "NPK + Monitor"
        elif prio == "Medium":
            rec = "Field Verification"
        else:
            rec = "Routine Monitoring"

        priority_zones.append({
            "block": display_name,
            "anomalies": anomalies,
            "pctAffected": round(pct_affected, 1),
            "priority": prio,
            "priorityWeight": priority_weights[prio],
            "recommendation": rec,
            "raw": r
        })

    # Sort priority zones by anomalies count descending
    priority_zones.sort(key=lambda x: x["anomalies"], reverse=True)

    # Note if all zones share same priority level
    unique_priorities = {z["priority"] for z in priority_zones}
    all_same_priority_note = None
    if len(unique_priorities) == 1:
        prio_level = list(unique_priorities)[0]
        all_same_priority_note = f"All zones classified {prio_level.upper()} this period. No critical intervention required."

    # Section 6: Intervention summary table grouping
    # Group all zones that share same recommendation into one row
    intervention_groups = {}
    for z in priority_zones:
        rec_name = z["recommendation"]
        
        # Map recommendation to Program Name
        if rec_name == "NPK + Monitor":
            prog = "Growth Enhancement Program"
        elif rec_name == "Field Verification":
            prog = "Field Verification Program"
        elif rec_name == "Replanting Assessment":
            prog = "Replanting Program"
        else:
            prog = "Routine Monitoring"
            
        if prog not in intervention_groups:
            intervention_groups[prog] = {"zones_count": 0, "trees_sum": 0, "max_priority": "Low"}
        intervention_groups[prog]["zones_count"] += 1
        intervention_groups[prog]["trees_sum"] += z["anomalies"]
        
        # Compare priorities/urgency
        if priority_weights[z["priority"]] > priority_weights[intervention_groups[prog]["max_priority"]]:
            intervention_groups[prog]["max_priority"] = z["priority"]

    intervention_summary = []
    for prog, data_item in intervention_groups.items():
        # Label: "All zones" if count matches deduplicated count, else "N zones"
        zones_label = "All zones" if data_item["zones_count"] == len(priority_zones) else f"{data_item['zones_count']} zones"
        intervention_summary.append({
            "programName": prog,
            "affectedZones": zones_label,
            "estimatedTrees": f"{data_item['trees_sum']:,} trees",
            "urgency": data_item["max_priority"]
        })

    # Section 3: Executive Summary (Agricultural analyst style matching user's prompt specifications)
    worst_zone = priority_zones[0] if priority_zones else None
    worst_zone_name = worst_zone["block"] if worst_zone else "N/A"
    worst_zone_anomalies = worst_zone["anomalies"] if worst_zone else 0
    worst_pct = worst_zone["pctAffected"] if worst_zone else 0.0

    primary_rec = worst_zone["recommendation"] if worst_zone else "Routine Monitoring"

    # Map English recommendation to Indonesian focus recommendation
    focus_rec_mapping = {
        "Replanting Assessment": "evaluasi penanaman kembali (replanting)",
        "NPK + Monitor": "pemupukan NPK dan pemantauan",
        "Field Verification": "verifikasi lapangan",
        "Routine Monitoring": "pemantauan rutin"
    }
    focus_rec_id = focus_rec_mapping.get(primary_rec, "pemantauan rutin")

    # Format tree count as dot-separated string
    formatted_trees = f"{total_trees:,}".replace(",", ".")

    exec_summary_text = (
        f"Pada bulan Juni 2026, sistem NyawitAI berhasil menyelesaikan {total_analyses} "
        f"analisis UAV yang mencakup {formatted_trees} pohon sawit di seluruh zona perkebunan. "
        f"Plantation Health Index tercatat pada angka {round(overall_health)}%, menunjukkan kondisi "
        f"keseluruhan yang stabil dibandingkan bulan sebelumnya. Zona {worst_zone_name} teridentifikasi "
        f"sebagai area prioritas utama yang memerlukan perhatian lebih lanjut. Fokus operasional "
        f"bulan depan disarankan pada program {focus_rec_id} di zona-zona dengan tren penurunan."
    )

    # Clean raw items from priority_zones output
    clean_priority_zones = []
    for pz in priority_zones:
        clean_priority_zones.append({
            "block": pz["block"],
            "anomalies": pz["anomalies"],
            "pctAffected": pz["pctAffected"],
            "priority": pz["priority"],
            "recommendation": pz["recommendation"]
        })

    # NEW SECTION DATA: INFERENCE ACTIVITY BY USER
    today = datetime.utcnow()
    start_of_month = datetime(today.year, today.month, 1)
    if today.month == 12:
        end_of_month = datetime(today.year + 1, 1, 1) - timedelta(seconds=1)
    else:
        end_of_month = datetime(today.year, today.month + 1, 1) - timedelta(seconds=1)

    inference_by_user = []
    user_counts_raw = db.query(
        User.full_name,
        User.username,
        func.count(InferenceLog.id).label("count")
    ).select_from(User).join(
        InferenceLog,
        (func.lower(InferenceLog.user_name) == func.lower(User.full_name)) |
        (func.lower(InferenceLog.user_name) == func.lower(User.username))
    ).filter(
        User.company_id == company_id,
        InferenceLog.company_id == company_id,
        InferenceLog.created_at.between(start_of_month, end_of_month)
    ).group_by(User.id).all()

    for row in user_counts_raw:
        name = row.full_name or row.username
        inference_by_user.append({
            "operator_name": name,
            "analysis_count": row.count
        })

    # Fallback if join returned nothing but logs exist:
    if not inference_by_user:
        logs_grouped = db.query(
            InferenceLog.user_name,
            func.count(InferenceLog.id).label("count")
        ).filter(
            InferenceLog.company_id == company_id,
            InferenceLog.created_at.between(start_of_month, end_of_month)
        ).group_by(InferenceLog.user_name).all()
        for row in logs_grouped:
            inference_by_user.append({
                "operator_name": row.user_name,
                "analysis_count": row.count
            })

    inference_by_user.sort(key=lambda x: x["analysis_count"], reverse=True)

    total_active_operators = len(inference_by_user)
    if total_active_operators > 0:
        most_active_item = inference_by_user[0]
        most_active_operator = {
            "name": most_active_item["operator_name"],
            "count": most_active_item["analysis_count"]
        }
        total_month_analyses = sum(x["analysis_count"] for x in inference_by_user)
        avg_analyses_per_operator = round(total_month_analyses / total_active_operators, 1)
    else:
        most_active_operator = {"name": "N/A", "count": 0}
        avg_analyses_per_operator = 0.0

    # DAILY INFERENCE VOLUME: per-day total count for current month (day 1 → today)
    daily_vol_raw = db.query(
        func.date(InferenceLog.created_at).label("day_date"),
        func.count(InferenceLog.id).label("count")
    ).filter(
        InferenceLog.company_id == company_id,
        InferenceLog.created_at.between(start_of_month, end_of_month)
    ).group_by(func.date(InferenceLog.created_at)).order_by("day_date").all()

    vol_map = {str(r.day_date): r.count for r in daily_vol_raw}

    # Build list from day 1 to today
    from datetime import date as _date
    today_date = today.date()
    first_of_month = _date(today.year, today.month, 1)

    daily_inference_volume = []
    cur_day = first_of_month
    while cur_day <= today_date:
        d_str = str(cur_day)
        daily_inference_volume.append({
            "date": cur_day.strftime("%b %d"),
            "day": cur_day.day,
            "count": vol_map.get(d_str, 0)
        })
        cur_day = _date.fromordinal(cur_day.toordinal() + 1)

    # PER-USER DAILY BREAKDOWN: for the chart legend (top 5 users by month count)
    top_users = [u["operator_name"] for u in inference_by_user[:5]]

    user_daily_raw = db.query(
        func.date(InferenceLog.created_at).label("day_date"),
        InferenceLog.user_name,
        func.count(InferenceLog.id).label("count")
    ).filter(
        InferenceLog.company_id == company_id,
        InferenceLog.created_at.between(start_of_month, end_of_month)
    ).group_by(
        func.date(InferenceLog.created_at),
        InferenceLog.user_name
    ).order_by("day_date").all()

    # Build map: {date_str: {user_name: count}}
    user_day_map: dict = {}
    for r in user_daily_raw:
        ds = str(r.day_date)
        if ds not in user_day_map:
            user_day_map[ds] = {}
        # Normalize name
        raw_name = (r.user_name or "").strip()
        norm_name = raw_name.capitalize()
        user_day_map[ds][norm_name] = user_day_map[ds].get(norm_name, 0) + r.count

    return {
        "totalAnalyses": total_analyses,
        "totalTrees": total_trees,
        "healthScore": round(overall_health, 1),
        "healthDistribution": {
            "healthy": healthy,
            "yellowing": yellowing,
            "smallCanopy": small_canopy,
            "dead": dead
        },
        "trend30Days": trend_points,
        "priorityZones": clean_priority_zones,
        "allSamePriorityNote": all_same_priority_note,
        "interventionSummary": intervention_summary,
        "executiveSummaryText": exec_summary_text,
        # Inference activity fields
        "inferenceByUser": inference_by_user,
        "totalActiveOperators": total_active_operators,
        "mostActiveOperator": most_active_operator,
        "avgAnalysesPerOperator": avg_analyses_per_operator,
        # Monthly volume chart data
        "dailyInferenceVolume": daily_inference_volume,
        "topUserNames": top_users
    }

@router.get("/reports/user-activity")
def get_user_activity_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    company_id = current_user.company_id
    users = db.query(User).filter(User.company_id == company_id).all()
    
    # Fetch logs count and confidence per user
    logs_by_user = db.query(
        InferenceLog.user_name,
        func.count(InferenceLog.id).label("count"),
        func.avg(InferenceLog.confidence_score).label("avg_conf")
    ).filter(InferenceLog.company_id == company_id).group_by(InferenceLog.user_name).all()

    logs_map = {}
    for row in logs_by_user:
        if row.user_name:
            logs_map[row.user_name.lower().strip()] = (row.count, row.avg_conf or 0.0)

    user_rows = []
    for u in users:
        # Match user logs
        name_key = (u.full_name or u.username or "").lower().strip()
        total_logs, avg_conf = logs_map.get(name_key, (0, 0.0))

        # We treat average confidence score as Success Rate for audit purposes
        success_rate = f"{round(avg_conf, 1)}%" if total_logs > 0 else "N/A"

        user_rows.append({
            "name": u.full_name or u.username or "Unknown",
            "email": u.email,
            "role": "Administrator" if u.role == "admin" else "Operator",
            "totalLogs": total_logs,
            "successRate": success_rate,
            "status": "Active" if u.status == "active" else "Pending",
            "lastActive": "2 mins ago" if u.status == "active" else "Offline"
        })

    return user_rows

@router.get("/reports/zone-comparison")
def get_zone_comparison_report(
    month: str = "Jun 2026",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    company_id = current_user.company_id

    # Fetch all logs with their recommendation details ordered by date desc
    all_logs = db.query(
        InferenceLog.block_name,
        VraRecommendation.overall_priority,
        VraRecommendation.healthy_count,
        VraRecommendation.yellowing_count,
        VraRecommendation.small_canopy_count,
        VraRecommendation.dead_count,
        InferenceLog.trees_count,
        InferenceLog.created_at
    ).join(VraRecommendation, VraRecommendation.inference_log_id == InferenceLog.id)\
     .filter(InferenceLog.company_id == company_id)\
     .order_by(InferenceLog.created_at.desc()).all()

    # Case-insensitive grouping — keep ALL rows per zone key for coverage count
    zone_latest = {}
    for row in all_logs:
        name = row.block_name.strip()
        key = name.lower()
        if key not in zone_latest:
            zone_latest[key] = []
        zone_latest[key].append(row)

    deduplicated_zones = []
    for key, rows in zone_latest.items():
        # rows sorted desc by created_at — latest row first
        # Coverage = total raw row count for this zone key (all-time analyses)
        coverage_count = len(rows)
        last_analyzed_dt = rows[0].created_at  # most recent

        # Deduplicate by data fingerprint for distinct snapshots
        seen_data = set()
        group_rows = []
        for r in rows:
            data_fingerprint = (r.healthy_count, r.yellowing_count, r.small_canopy_count, r.dead_count, r.trees_count)
            if data_fingerprint not in seen_data:
                seen_data.add(data_fingerprint)
                group_rows.append(r)

        # Determine title-cased base name
        base_name = ' '.join(w.capitalize() for w in rows[0].block_name.split())

        # If multiple distinct snapshots, append Block identifier like (A), (B)
        if len(group_rows) > 1:
            alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            for idx, r in enumerate(group_rows):
                suffix = alphabet[idx % 26]
                deduplicated_zones.append((r, f"{base_name} ({suffix})", coverage_count, last_analyzed_dt))
        else:
            for r in group_rows:
                deduplicated_zones.append((r, base_name, coverage_count, last_analyzed_dt))

    zones = []
    summary_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    priority_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}

    now_utc = datetime.utcnow()

    for r, display_name, coverage_count, last_analyzed_dt in deduplicated_zones:
        total = r.trees_count or 1
        healthy_pct = (r.healthy_count / total * 100)
        anomaly_pct = 100.0 - healthy_pct
        anomalies = r.dead_count + r.yellowing_count + r.small_canopy_count

        # Urgency level priority mapping
        prio = "LOW"
        if r.dead_count >= 4:
            prio = "CRITICAL"
        elif r.dead_count >= 3:
            prio = "HIGH"
        elif r.small_canopy_count > 200 or r.yellowing_count > 20:
            prio = "MEDIUM"
        else:
            prio = "LOW"

        summary_counts[prio] += 1

        # Coverage: last analysis date formatted
        last_analyzed_str = last_analyzed_dt.strftime("%b %d, %Y") if last_analyzed_dt else "N/A"
        if last_analyzed_dt:
            dt_naive = last_analyzed_dt.replace(tzinfo=None)
            days_since = (now_utc - dt_naive).days
        else:
            days_since = 999

        # Treatment plans (max 3 words)
        if prio == "CRITICAL":
            plans = ["Immediate Replanting"]
        elif prio == "HIGH":
            plans = ["NPK Fertilization"]
        elif prio == "MEDIUM":
            plans = ["Field Verification"]
        else:
            plans = ["Routine Maintenance"]

        zones.append({
            "zone": display_name,
            "healthy": round(healthy_pct, 1),
            "anomalyPct": round(anomaly_pct, 1),
            "trees": r.trees_count,
            "anomalies": anomalies,
            "deadCount": r.dead_count,
            "priority": prio,
            "coverageCount": coverage_count,
            "lastAnalyzed": last_analyzed_str,
            "daysSinceAnalysis": days_since,
            "treatmentPlans": plans
        })

    # Sort zones by priority severity (highest first), then by health% ascending (worst first)
    zones.sort(key=lambda x: (-priority_order[x["priority"]], x["healthy"]))

    # Group zones by treatment plan / dispatch program name
    dispatch_groups = {}
    for z in zones:
        # Determine programmatic name for Section 6 grouping
        prio = z["priority"]
        if prio == "CRITICAL":
            prog = "Immediate Replanting"
        elif prio == "HIGH":
            prog = "NPK Fertilization"
        elif prio == "MEDIUM":
            prog = "Canopy Monitoring"
        else:
            prog = "Routine Maintenance"

        if prog not in dispatch_groups:
            dispatch_groups[prog] = {
                "program": prog,
                "zones": [],
                "estimatedTrees": 0,
                "urgency": "LOW"
            }
        dispatch_groups[prog]["zones"].append(z["zone"])
        dispatch_groups[prog]["estimatedTrees"] += z["trees"]

        # Track highest urgency
        if priority_order[z["priority"]] > priority_order[dispatch_groups[prog]["urgency"]]:
            dispatch_groups[prog]["urgency"] = z["priority"]

    dispatch_summary = []
    for prog, item in dispatch_groups.items():
        urg = item["urgency"]
        dispatch_summary.append({
            "program": item["program"],
            "affectedCount": len(item["zones"]),
            "affectedZonesList": item["zones"],
            "estimatedTrees": f"{item['estimatedTrees']:,}",
            "urgency": urg
        })

    # Determine previous month query string
    month_mapping = {
        "Jun 2026": "May 2026",
        "May 2026": "Apr 2026",
        "Apr 2026": "Mar 2026",
        "Mar 2026": "Feb 2026"
    }
    prev_month = month_mapping.get(month, "May 2026")

    return {
        "summary": {
            "critical": summary_counts["CRITICAL"],
            "high": summary_counts["HIGH"],
            "medium": summary_counts["MEDIUM"],
            "low": summary_counts["LOW"]
        },
        "zones": zones,
        "dispatchSummary": dispatch_summary,
        "monitoringPeriod": f"{month} vs {prev_month}"
    }
