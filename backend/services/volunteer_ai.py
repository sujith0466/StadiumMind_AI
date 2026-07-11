def match_volunteer_to_task(task, available_volunteers):
    """
    AI heuristic to match the best volunteer.
    Takes into account the expanded capabilities.
    1. Context Builder: Location and Need
    2. Volunteer Availability: Filter active
    3. Accessibility Requirements: e.g. require sign_language=True
    4. Location Matching: Nearest
    5. Priority Engine: Elevate Emergency over Normal
    """
    # Stub logic returning a mock assignment
    best_match = None
    if available_volunteers:
        best_match = available_volunteers[0]
    return {
        "task_id": task.id if task else None,
        "assigned_volunteer_id": best_match.id if best_match else None,
        "confidence_score": 0.92
    }
