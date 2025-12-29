package com.gymtracker.constants;

public class AppConstants {
    
    // Pagination defaults
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Pagination parameter names
    public static final String PAGE_PARAM = "page";
    public static final String SIZE_PARAM = "size";
    public static final String SORT_PARAM = "sort";
    
    // Default sort
    public static final String DEFAULT_SORT_DIRECTION = "desc";
    public static final String DEFAULT_SESSION_SORT_FIELD = "sessionDate";
    public static final String DEFAULT_WORKOUT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_EXERCISE_SORT_FIELD = "name";
    
    // Private constructor to prevent instantiation
    private AppConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
