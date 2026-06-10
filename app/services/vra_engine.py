class VraRuleEngine:
    PRIORITY_ORDER = {"Low": 0, "Medium": 1, "High": 2, "Critical": 3}

    @staticmethod
    def get_priority_tier(percentage: float, threshold_type: str) -> str:
        """
        Determine priority tier based on percentage and class type.
        """
        if threshold_type in ("yellowing", "small_canopy"):
            if percentage <= 5.0:
                return "Low"
            elif percentage <= 15.0:
                return "Medium"
            elif percentage <= 30.0:
                return "High"
            else:
                return "Critical"
        elif threshold_type == "dead":
            if percentage <= 1.0:
                return "Low"
            elif percentage <= 3.0:
                return "Medium"
            elif percentage <= 5.0:
                return "High"
            else:
                return "Critical"
        return "Low"

    @classmethod
    def generate_recommendation(
        cls, healthy: int, yellowing: int, small_canopy: int, dead: int
    ) -> dict:
        total = healthy + yellowing + small_canopy + dead
        if total == 0:
            return {
                "healthy_count": healthy,
                "yellowing_count": yellowing,
                "small_canopy_count": small_canopy,
                "dead_count": dead,
                "overall_priority": "Low",
                "primary_concern": "None",
                "secondary_concern": "None",
                "recommended_programs": "Routine Monitoring Program",
            }

        # Calculate percentages
        p_yellowing = (yellowing / total) * 100.0
        p_small = (small_canopy / total) * 100.0
        p_dead = (dead / total) * 100.0

        # Tiers
        t_yellowing = cls.get_priority_tier(p_yellowing, "yellowing")
        t_small = cls.get_priority_tier(p_small, "small_canopy")
        t_dead = cls.get_priority_tier(p_dead, "dead")

        # Determine overall priority
        priorities = [t_yellowing, t_small, t_dead]
        overall_val = max(cls.PRIORITY_ORDER[p] for p in priorities)
        overall_priority = [k for k, v in cls.PRIORITY_ORDER.items() if v == overall_val][0]

        # Determine concerns
        # We sort active concerns (value > 0/Low) by severity first: Dead > Yellowing > Small Canopy,
        # then by priority score, then by percentage.
        concerns_list = []
        if cls.PRIORITY_ORDER[t_dead] > 0:
            concerns_list.append(("Dead Trees", cls.PRIORITY_ORDER[t_dead], p_dead))
        if cls.PRIORITY_ORDER[t_yellowing] > 0:
            concerns_list.append(("Yellowing Canopy", cls.PRIORITY_ORDER[t_yellowing], p_yellowing))
        if cls.PRIORITY_ORDER[t_small] > 0:
            concerns_list.append(("Small Canopy", cls.PRIORITY_ORDER[t_small], p_small))

        # Sort concerns: highest priority score first, then severity (Dead > Yellowing > Small)
        # Note: Dead is first in the list, Yellowing second, Small Canopy third.
        # Python's stable sort or sorting key: (priority_score, -index_in_severity_list)
        # We can sort by priority score descending, then severity rank descending
        severity_rank = {
            "Dead Trees": 3,
            "Yellowing Canopy": 2,
            "Small Canopy": 1
        }
        concerns_sorted = sorted(
            concerns_list,
            key=lambda x: (x[1], severity_rank[x[0]]),
            reverse=True
        )

        primary_concern = "None"
        secondary_concern = "None"
        if len(concerns_sorted) > 0:
            primary_concern = f"{concerns_sorted[0][0]} ({concerns_sorted[0][2]:.1f}%)"
        if len(concerns_sorted) > 1:
            secondary_concern = f"{concerns_sorted[1][0]} ({concerns_sorted[1][2]:.1f}%)"

        # Determine recommended programs
        programs = []
        if cls.PRIORITY_ORDER[t_dead] > 0:
            programs.append("Replanting Assessment Program")
        if cls.PRIORITY_ORDER[t_yellowing] > 0:
            programs.append("Corrective Fertilization Program")
        if cls.PRIORITY_ORDER[t_small] > 0:
            programs.append("Growth Enhancement Program")

        if not programs:
            programs.append("Routine Monitoring Program")

        recommended_programs = ", ".join(programs)

        return {
            "healthy_count": healthy,
            "yellowing_count": yellowing,
            "small_canopy_count": small_canopy,
            "dead_count": dead,
            "overall_priority": overall_priority,
            "primary_concern": primary_concern,
            "secondary_concern": secondary_concern,
            "recommended_programs": recommended_programs,
        }
