package com.gymtracker.enums;

public enum Equipment {
    BARBELL("Barbell", "Long bar with weight plates"),
    DUMBBELLS("Dumbbells", "Handheld weights"),
    KETTLEBELLS("Kettlebells", "Cast iron weights with handles"),
    CABLE_MACHINE("Cable Machine", "Weight stack with pulley system"),
    SMITH_MACHINE("Smith Machine", "Barbell on fixed rails"),
    LEG_PRESS("Leg Press", "Machine for leg exercises"),
    HACK_SQUAT("Hack Squat", "Machine for squats"),
    LEG_EXTENSION("Leg Extension", "Machine for quadriceps"),
    LEG_CURL("Leg Curl", "Machine for hamstrings"),
    LAT_PULLDOWN("Lat Pulldown", "Machine for back exercises"),
    CABLE_ROW("Cable Row", "Machine for back exercises"),
    PEC_DECK("Pec Deck", "Machine for chest flyes"),
    DIP_STATION("Dip Station", "Parallel bars for dips"),
    PULL_UP_BAR("Pull-up Bar", "Horizontal bar for pull-ups"),
    BENCH_PRESS("Bench Press", "Flat/incline/decline bench"),
    SQUAT_RACK("Squat Rack", "Power rack for squats"),
    RESISTANCE_BANDS("Resistance Bands", "Elastic bands for resistance"),
    MEDICINE_BALL("Medicine Ball", "Weighted ball for exercises"),
    STABILITY_BALL("Stability Ball", "Large exercise ball"),
    FOAM_ROLLER("Foam Roller", "Roller for muscle recovery"),
    JUMP_ROPE("Jump Rope", "Rope for cardio"),
    PUNCHING_BAG("Punching Bag", "Bag for boxing exercises"),
    SPEED_BAG("Speed Bag", "Small bag for speed training"),
    BOXING_GLOVES("Boxing Gloves", "Gloves for boxing"),
    WRAPS("Wraps", "Hand wraps for support"),
    BELT("Belt", "Weightlifting belt"),
    STRAPS("Straps", "Lifting straps"),
    CHALK("Chalk", "Grip enhancement"),
    NONE("None", "Bodyweight exercises only"),
    TREADMILL("Treadmill", "Cardio machine"),
    ELLIPTICAL("Elliptical", "Low-impact cardio machine"),
    STATIONARY_BIKE("Stationary Bike", "Indoor cycling"),
    ROWING_MACHINE("Rowing Machine", "Cardio rowing equipment"),
    STAIR_CLIMBER("Stair Climber", "Step machine"),
    STEP_UP("Step Up", "Elevated platform for step exercises");

    private final String displayName;
    private final String description;

    Equipment(String displayName, String description) {
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
