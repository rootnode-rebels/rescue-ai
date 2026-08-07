# Triage scoring logic: deterministic, explainable.
from typing import Dict, Tuple, List
import math
import datetime

def compute_life_risk(sf: Dict, desc: str) -> int:
    # direct life indicators
    keywords = ['unconscious','not breathing','no pulse','chest pain','severe bleeding','bleeding','head injury']
    text = (desc or '').lower()
    for k in keywords:
        if k in text:
            return 100
    if sf.get('unconscious') or sf.get('breathing_issue'):
        return 95
    if sf.get('trapped_count',0) > 0 and (sf.get('water_level_cm',0) > 30):
        return 80
    return 20

def compute_vulnerability(sf: Dict) -> int:
    score = 0
    score += min(50, sf.get('children_count',0) * 30)
    score += min(50, sf.get('elderly_count',0) * 40)
    if sf.get('pregnant'): score += 40
    return min(100, score)

def compute_time_criticality(created_iso: str, sf: Dict) -> int:
    try:
        created = datetime.datetime.fromisoformat(created_iso.replace('Z',''))
        elapsed = (datetime.datetime.utcnow() - created).total_seconds()
        # more elapsed -> more critical if no help
        if elapsed < 60: return 20
        if elapsed < 5*60: return 50
        return 80
    except Exception:
        return 40

def compute_accessibility(sf: Dict) -> int:
    # 100 is difficult to access
    return 100 if sf.get('no_vehicle_access') else 20

def compute_confidence(desc: str, gps_accuracy: float) -> float:
    # naive confidence: keywords present + GPS accuracy
    score = 0.5
    if desc and len(desc) > 20: score += 0.2
    if gps_accuracy and gps_accuracy < 50: score += 0.2
    return min(0.95, score)

def triage_score(payload: Dict) -> Tuple[int,str,float,List[str]]:
    sf = payload.get('structured_fields', {}) or {}
    desc = payload.get('description','') or ''
    loc = payload.get('location',{})
    life = compute_life_risk(sf, desc)
    vuln = compute_vulnerability(sf)
    timec = compute_time_criticality(payload.get('created_at', datetime.datetime.utcnow().isoformat()), sf)
    access = compute_accessibility(sf)
    confidence = compute_confidence(desc, loc.get('accuracy_m') or loc.get('accuracy') or 100)
    # weights
    score = 0.35*life + 0.25*vuln + 0.2*timec + 0.1*access + 0.1*(confidence*100)
    score = int(max(0, min(100, round(score))))
    if score >= 80: label = 'critical'
    elif score >= 60: label = 'high'
    elif score >= 40: label = 'medium'
    else: label = 'low'
    # reasons: top contributing simple rules
    reasons = []
    if life >= 80: reasons.append('life-threatening indicator')
    if sf.get('trapped_count',0) > 0: reasons.append(f"{sf.get('trapped_count')} trapped")
    if sf.get('children_count',0) > 0: reasons.append(f"{sf.get('children_count')} children")
    if sf.get('elderly_count',0) > 0: reasons.append(f"{sf.get('elderly_count')} elderly")
    if sf.get('water_level_cm',0) > 0: reasons.append(f"water level {sf.get('water_level_cm')} cm")
    if access > 50: reasons.append('access difficulty')
    if len(reasons) == 0:
        reasons.append('description-based assessment')
    return score, label, float(confidence), reasons
