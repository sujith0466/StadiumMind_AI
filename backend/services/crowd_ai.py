def calculate_density(occupancy, max_capacity):
    """
    Translates raw numbers into a 0-1 congestion index.
    """
    if max_capacity <= 0:
        return 1.0
    return min(1.0, occupancy / max_capacity)


def generate_safe_route(start_zone, end_zone, congested_zones):
    """
    AI heuristic routing to bypass congested zones.
    """
    return {
        "start_zone": start_zone,
        "end_zone": end_zone,
        "waypoints": [start_zone, 99, end_zone],  # 99 is a simulated safe bypass
        "is_active": True,
    }
