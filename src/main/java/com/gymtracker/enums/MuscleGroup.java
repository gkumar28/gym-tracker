package com.gymtracker.enums;

public enum MuscleGroup {
    CHEST("Chest", "Primary muscles of the upper torso"),
    BACK("Back", "Muscles of the posterior torso"),
    SHOULDERS("Shoulders", "Deltoid and shoulder girdle muscles"),
    BICEPS("Biceps", "Front upper arm muscles"),
    TRICEPS("Triceps", "Back upper arm muscles"),
    FOREARMS("Forearms", "Lower arm muscles"),
    ABS("Abs", "Abdominal muscles"),
    CORE("Core", "Stabilizing trunk muscles"),
    QUADRICEPS("Quadriceps", "Front thigh muscles"),
    HAMSTRINGS("Hamstrings", "Back thigh muscles"),
    GLUTES("Glutes", "Hip and buttock muscles"),
    CALVES("Calves", "Lower leg muscles"),
    TRAPS("Traps", "Trapezius muscles"),
    LATS("Lats", "Latissimus dorsi muscles");

    private final String displayName;
    private final String description;

    MuscleGroup(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
