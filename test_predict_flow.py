import os
import httpx
import sys

# Change this if your backend runs on a different port/domain on the VPS
BASE_URL = "http://localhost:8050/api"

def test_full_predict_flow():
    # 1. Ask for login credentials
    identifier = input("Masukkan Username/Email login: ").strip()
    password = input("Masukkan Password login: ").strip()

    client = httpx.Client(base_url=BASE_URL, timeout=60.0)

    # 2. Login to get token
    print("\n[1/3] Melakukan login...")
    try:
        login_res = client.post("/login", json={
            "identifier": identifier,
            "password": password
        })
        if login_res.status_code != 200:
            print(f"[-] Login gagal ({login_res.status_code}): {login_res.text}")
            sys.exit(1)
        
        token = login_res.json().get("access_token")
        print("[+] Login sukses! Token didapatkan.")
    except Exception as e:
        print(f"[-] Gagal terhubung ke backend: {e}")
        sys.exit(1)

    # 3. Download a sample palm tree image for testing
    print("\n[2/3] Mengunduh gambar uji coba (palm tree)...")
    img_url = "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500"
    try:
        img_res = httpx.get(img_url)
        if img_res.status_code != 200:
            print(f"[-] Gagal mengunduh gambar uji coba: {img_res.status_code}")
            sys.exit(1)
        
        temp_img_path = "temp_test_palm.jpg"
        with open(temp_img_path, "wb") as f:
            f.write(img_res.content)
        print(f"[+] Gambar uji coba disimpan di {temp_img_path}")
    except Exception as e:
        print(f"[-] Error mengunduh gambar: {e}")
        sys.exit(1)

    # 4. Upload to backend prediction endpoint
    print("\n[3/3] Mengirimkan gambar ke /api/predict...")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        with open(temp_img_path, "rb") as f:
            files = {"file": ("temp_test_palm.jpg", f, "image/jpeg")}
            data = {"block_name": "Test Block Antigravity"}
            
            predict_res = client.post(
                "/predict", 
                headers=headers, 
                files=files, 
                data=data
            )
            
        if predict_res.status_code == 200:
            print("[+] PREDIKSI BERHASIL!")
            print(predict_res.json())
        else:
            print(f"[-] Prediksi gagal ({predict_res.status_code}):")
            print(predict_res.text)
            
    except Exception as e:
        print(f"[-] Error mengirimkan request prediksi: {e}")
    finally:
        # Cleanup
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)

if __name__ == "__main__":
    test_full_predict_flow()
