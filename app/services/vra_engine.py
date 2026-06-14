import os
import json
import logging
from dotenv import load_dotenv
from openai import OpenAI

logger = logging.getLogger(__name__)

load_dotenv()
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")

if DASHSCOPE_API_KEY:
    _client = OpenAI(
        api_key=DASHSCOPE_API_KEY,
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )
else:
    _client = None
    logger.warning("DASHSCOPE_API_KEY tidak ditemukan di environment variables.")

MODELS = ["qwen3.5-flash", "deepseek-v4-flash"]
_current_model_idx = 0

def get_next_model():
    global _current_model_idx
    model = MODELS[_current_model_idx]
    _current_model_idx = (_current_model_idx + 1) % len(MODELS)
    return model

# Structured Indonesian Palm Tree Agronomic Knowledge Base for RAG retrieval
AGRONOMIC_KNOWLEDGE_BASE = {
    "healthy": (
        "Rekomendasi Pohon Sawit Sehat:\n"
        "- Pemantauan visual berkala pada kondisi pelepah dan piringan sawit.\n"
        "- Lakukan pemeliharaan rutin dan pemupukan standar NPK berkala dosis 2.0-2.5 kg/pohon/tahun disebar di piringan pohon."
    ),
    "yellowing": (
        "Rekomendasi Penanganan Pelepah Menguning (Yellowing):\n"
        "- Jika menguning akibat defisiensi Magnesium, aplikasikan Kieserite (MgSO4) dosis 1.5-2.0 kg/pohon.\n"
        "- Jika bercak kuning/oranye akibat defisiensi Kalium, sebarkan KCl (MOP) dosis 2.0-3.0 kg/pohon secara merata."
    ),
    "small_canopy": (
        "Rekomendasi Stimulasi Kanopi Kecil / Kerdil (Small Canopy):\n"
        "- Berikan NPK booster dengan penambahan Urea/ZA dosis tinggi (1.0-1.5 kg/pohon) untuk memacu zat hijau daun.\n"
        "- Taburkan pupuk mikro Borate (Boron) dosis 50-100 gram/pohon di ketiak pelepah daun sawit muda."
    ),
    "dead": (
        "Rekomendasi Penanganan Pohon Mati / Hilang (Dead / Missing):\n"
        "- Bongkar tunggul pohon mati guna sanitasi tanah dan cegah penyebaran patogen busuk pangkal batang.\n"
        "- Taburkan Trichoderma spp. 150-200 gram per lubang tanam sebelum menanam kembali bibit sawit unggul bersertifikat."
    )
}

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
        
        # Define local RAG fallback first
        fallback_json = {
            "healthy": "Lakukan pemantauan rutin kondisi visual pelepah dan jalankan pemupukan standar NPK berkala dosis 2.0 kg/pohon/tahun.",
            "yellowing": "Taburkan pupuk MgSO4 (Kieserite) dosis 1.5-2.0 kg/pohon untuk defisiensi Mg, atau KCl dosis 2.0-3.0 kg/pohon untuk defisiensi K.",
            "small_canopy": "Berikan pupuk Urea/ZA dosis tinggi (1.0-1.5 kg/pohon) dan pupuk Borate 50-100 gram/pohon di ketiak pelepah daun sawit.",
            "dead": "Lakukan sanitasi tanah dengan Trichoderma spp. 150 gram per lubang tanam sebelum melakukan penyulaman bibit sawit baru."
        }
        llm_recommendations = json.dumps(fallback_json)

        if total == 0:
            return {
                "healthy_count": healthy,
                "yellowing_count": yellowing,
                "small_canopy_count": small_canopy,
                "dead_count": dead,
                "overall_priority": "Low",
                "primary_concern": "None",
                "secondary_concern": "None",
                "recommended_programs": llm_recommendations,
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
        concerns_list = []
        if cls.PRIORITY_ORDER[t_dead] > 0:
            concerns_list.append(("Dead Trees", cls.PRIORITY_ORDER[t_dead], p_dead))
        if cls.PRIORITY_ORDER[t_yellowing] > 0:
            concerns_list.append(("Yellowing Canopy", cls.PRIORITY_ORDER[t_yellowing], p_yellowing))
        if cls.PRIORITY_ORDER[t_small] > 0:
            concerns_list.append(("Small Canopy", cls.PRIORITY_ORDER[t_small], p_small))

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

        # --- RETRIEVAL STEP: Fetch relevant knowledge base documents ---
        retrieved_docs = []
        if healthy > 0:
            retrieved_docs.append(AGRONOMIC_KNOWLEDGE_BASE["healthy"])
        if yellowing > 0:
            retrieved_docs.append(AGRONOMIC_KNOWLEDGE_BASE["yellowing"])
        if small_canopy > 0:
            retrieved_docs.append(AGRONOMIC_KNOWLEDGE_BASE["small_canopy"])
        if dead > 0:
            retrieved_docs.append(AGRONOMIC_KNOWLEDGE_BASE["dead"])
        
        context_str = "\n\n".join(retrieved_docs)

        # --- AUGMENTATION & GENERATION (LLM call) ---
        if _client:
            model = get_next_model()
            system_prompt = (
                "Kamu adalah AI Agronomis Ahli Kelapa Sawit yang bekerja di NyawitAI.\n"
                "Tugasmu adalah memberikan rekomendasi agronomis presisi berdasarkan DOKUMEN REFERENSI (KNOWLEDGE BASE) yang disediakan.\n"
                "Kamu harus menjawab secara akurat dan HANYA menggunakan informasi agronomis dari DOKUMEN REFERENSI tersebut untuk merekomendasikan tindakan.\n"
                "Balas HANYA JSON valid dengan key \"healthy\", \"yellowing\", \"small_canopy\", \"dead\". Tanpa markdown, tanpa ```, tanpa tambahan teks."
            )
            user_prompt = (
                f"--- DOKUMEN REFERENSI AGRONOMI (KNOWLEDGE BASE) ---\n"
                f"{context_str}\n"
                f"--------------------------------------------------\n\n"
                f"Hasil deteksi visual UAV pada Blok Kebun menunjukkan:\n"
                f"- Pohon Sehat (healthy): {healthy} pohon\n"
                f"- Pohon Menguning (yellowing): {yellowing} pohon\n"
                f"- Pohon Kanopi Kecil (small_canopy): {small_canopy} pohon\n"
                f"- Pohon Mati/Hilang (dead): {dead} pohon\n\n"
                f"Berdasarkan dokumen referensi di atas, berikan rekomendasi tindakan agronomis singkat (1 kalimat padat langsung ke inti) untuk masing-masing 4 kondisi tersebut.\n"
                f"Kembalikan respon dalam format JSON murni seperti ini:\n"
                f"{{\n"
                f"  \"healthy\": \"rekomendasi untuk kondisi sehat...\",\n"
                f"  \"yellowing\": \"rekomendasi untuk kondisi menguning...\",\n"
                f"  \"small_canopy\": \"rekomendasi untuk kondisi kanopi kecil...\",\n"
                f"  \"dead\": \"rekomendasi untuk kondisi mati...\"\n"
                f"}}"
            )
            try:
                response = _client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.15,
                    max_tokens=400
                )
                content = response.choices[0].message.content.strip()
                # Clean up markdown
                content = content.replace('*', '')
                if content.startswith('```json'):
                    content = content[7:]
                if content.startswith('```'):
                    content = content[3:]
                if content.endswith('```'):
                    content = content[:-3]
                
                # Verify it parses to a valid JSON dict
                parsed_res = json.loads(content.strip())
                if isinstance(parsed_res, dict) and all(k in parsed_res for k in ["healthy", "yellowing", "small_canopy", "dead"]):
                    llm_recommendations = json.dumps(parsed_res)
                    logger.info("Successfully generated VRA recommendation using RAG method and Qwen LLM.")
                else:
                    logger.warning("LLM response did not contain all required keys, using RAG fallback.")
            except Exception as e:
                logger.error(f"LLM/RAG generation error: {e}. Using RAG fallback recommendations.")

        return {
            "healthy_count": healthy,
            "yellowing_count": yellowing,
            "small_canopy_count": small_canopy,
            "dead_count": dead,
            "overall_priority": overall_priority,
            "primary_concern": primary_concern,
            "secondary_concern": secondary_concern,
            "recommended_programs": llm_recommendations,
        }

