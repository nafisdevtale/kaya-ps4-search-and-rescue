# Edge Risk Engine: Rules & Heuristics Matrix

**System:** PS4 Search & Rescue Command Center  
**Team:** Team ANOMALY (KT-2047)  
**Classification:** Experimental Prototype Prioritization Logic  
**Disclaimer:** This logic represents prototype algorithmic prioritization for competition demonstration purposes and is NOT certified against official emergency services dispatch standards (e.g. NFPA, FEMA, or ICAO).

---

## 1. Objective

During large-scale disaster response (earthquakes, wildfires, flash floods), emergency responders are overwhelmed by raw sensory streams. The **Edge Risk Engine** automatically synthesizes raw multi-sensor detections into actionable priority tiers to accelerate field triage.

---

## 2. Detection Classes

### Primary MVP Classes:
- `PERSON`: Unconfirmed visual human candidate.
- `SURVIVOR`: Thermally verified live human presence.
- `FIRE`: Active flame or thermal hotspot (>150°C).
- `SMOKE`: Plume or particulate cloud obscuring visibility.
- `FLOOD`: Surface water accumulation encroaching on pathways.
- `DEBRIS`: Physical wreckage, collapsed concrete, or road blockages.

### Secondary Experimental Classes:
- `DAMAGED STRUCTURE`: Cracked masonry or compromised framework.
- `LANDSLIDE`: Soil/mud displacement blocking access routes.
- `VEHICLE`: Trapped or abandoned automotive transport.
- `ELECTRICAL WIRE`: Downed power cables presenting electrocution hazard.

*(Note: Chemical leak detection is strictly scoped for future gas sensor payloads and is NOT implemented in this prototype).*

---

## 3. Priority Evaluation Matrix

The engine combines single-hazard severity with spatial compound rules (hazards located within 25 meters of each other):

| Detected Condition | Spatial Correlation | Prototype Risk Tier | Tactical Action |
| :--- | :--- | :--- | :--- |
| **Survivor + Active Fire** | Distance < 25m | **CRITICAL** (Red) | Immediate emergency beacon dispatch; prioritize rescue route |
| **Survivor Alone** | Confirmed thermal signature | **HIGH** (Amber-Red) | Alert search teams; calculate geodetic evacuation vector |
| **Active Fire** | Structural proximity | **HIGH** (Red-Orange) | Coordinate fire containment; redirect search pattern away from downdrafts |
| **Flash Flood** | Active ingress | **HIGH** (Cyan-Blue) | Flag low-lying escape route failure |
| **Smoke Plume** | High density | **MEDIUM** (Orange) | Note wind drift vector; adjust optical camera gain |
| **Debris / Obstacle** | Search path obstruction | **MEDIUM** (Amber) | Log ground impassability for wheeled/tracked recovery units |
| **Downed Electrical Wire**| Grounded wire | **HIGH** (Yellow-Amber) | Flag electrocution perimeter |
| **Isolated Vehicle** | Vacant | **LOW** (Gray) | Catalog for reference; continue primary sweep |

---

## 4. Compound Escalation Algorithm

When two incidents are detected within radius $R \le 25\text{ m}$:
```python
if has_class("SURVIVOR") and (has_class("FIRE") or has_class("ELECTRICAL_WIRE")):
    priority = Priority.CRITICAL
    alert_level = AlertLevel.EMERGENCY
elif has_class("SURVIVOR"):
    priority = Priority.HIGH
    alert_level = AlertLevel.WARNING
elif has_class("FIRE") or has_class("FLOOD"):
    priority = Priority.HIGH
    alert_level = AlertLevel.WARNING
elif has_class("SMOKE") or has_class("DEBRIS"):
    priority = Priority.MEDIUM
    alert_level = AlertLevel.INFO
else:
    priority = Priority.LOW
    alert_level = AlertLevel.ROUTINE
```
