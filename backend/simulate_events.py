# Use to create simulated SOS bursts for demo
import requests, random, time, os, sys
BACKEND = os.environ.get('BACKEND_URL','http://localhost:8000')

def rand_loc():
    # pick a base location
    base = (28.6139, 77.2090)  # New Delhi sample
    return base[0] + random.uniform(-0.01,0.01), base[1] + random.uniform(-0.01,0.01)

for i in range(20):
    lat,lng = rand_loc()
    payload = {
        "description": random.choice(["trapped","breathing issue","flooded","fire","injury"]),
        "user_id": f"sim_{i}",
        "device_id": "simulator",
        "structured_fields": {
            "trapped_count": random.choice([0,1,2,3]),
            "children_count": random.choice([0,1,2]),
            "elderly_count": random.choice([0,1]),
            "water_level_cm": random.choice([0,20,50,100])
        },
        "location": {"lat": lat, "lng": lng, "accuracy_m": 10},
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    r = requests.post(BACKEND + '/api/v1/sos', json=payload)
    print(i, r.status_code, r.text)
    time.sleep(0.3)
