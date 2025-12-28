import React from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Avatar, 
  ProgressBar,
  Surface,
  IconButton,
  Chip
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';
import { useTheme } from '../hooks/useTheme';
import { useDeviceType, useResponsiveValue, responsiveConfig } from '../hooks/useResponsive';

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const theme = useTheme();
  const deviceType = useDeviceType();
  const { width } = Dimensions.get('window');

  // Responsive values
  const padding = useResponsiveValue({
    mobile: 20,
    tablet: 32,
    desktop: 48
  });

  const statsColumns = useResponsiveValue({
    mobile: 2,
    tablet: 3,
    desktop: 4
  });

  const cardWidth = useResponsiveValue({
    mobile: (width - 52) / 2,
    tablet: (width - 76) / 3,
    desktop: (width - 100) / 4
  });

  const stats = [
    { label: 'Workouts', value: '12', color: theme.primary },
    { label: 'Sessions', value: '28', color: theme.secondary },
    { label: 'Progress', value: '+15%', color: theme.success },
    { label: 'Goals', value: '8/10', color: theme.warning },
  ];

  const quickActions = [
    { title: 'Quick Workout', subtitle: 'Start a new session', onPress: () => navigation.navigate('Workouts') },
    { title: 'View Progress', subtitle: 'Track your fitness journey', onPress: () => navigation.navigate('Sessions') },
    { title: 'Schedule', subtitle: 'Plan your workouts', onPress: () => navigation.navigate('Exercises') },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: padding * 2 }]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: padding }]}>
        <View>
          <Text variant="headlineLarge" style={[styles.greeting, { color: theme.text }]}>
            Welcome back!
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Ready to crush your fitness goals?
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, { paddingHorizontal: padding }]}>
        {stats.map((stat, index) => (
          <Surface key={index} style={[styles.statCard, { backgroundColor: theme.surface, width: cardWidth }]}>
            <View style={styles.statContent}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text variant="bodySmall" style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          </Surface>
        ))}
      </View>

      {/* Current Goal Card */}
      <Card style={[styles.goalCard, { backgroundColor: theme.surface, marginHorizontal: padding }]}>
        <Card.Content>
          <View style={styles.goalHeader}>
            <Text variant="titleMedium" style={{ color: theme.text }}>Current Goal</Text>
            <Chip mode="flat" textStyle={{ color: theme.primary }}>75% Complete</Chip>
          </View>
          <Text variant="bodyLarge" style={[styles.goalTitle, { color: theme.text }]}>
            Complete 30 workouts this month
          </Text>
          <Text variant="bodySmall" style={[styles.goalSubtitle, { color: theme.textSecondary }]}>
            22 of 30 workouts completed
          </Text>
          <ProgressBar 
            progress={0.75} 
            color={theme.primary} 
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={[styles.section, { paddingHorizontal: padding }]}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Actions
        </Text>
        {quickActions.map((action, index) => (
          <Surface key={index} style={[styles.actionCard, { backgroundColor: theme.surface }]}>
            <View style={styles.actionContent}>
              <View style={styles.actionText}>
                <Text variant="titleMedium" style={{ color: theme.text }}>
                  {action.title}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.textSecondary }}>
                  {action.subtitle}
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                onPress={action.onPress}
                iconColor={theme.textSecondary}
              />
            </View>
          </Surface>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={[styles.section, { paddingHorizontal: padding }]}>
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.text }]}>
          Recent Activity
        </Text>
        <Card style={[styles.activityCard, { backgroundColor: theme.surface }]}>
          <Card.Content>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: theme.success }]} />
              <View style={styles.activityText}>
                <Text variant="bodyMedium" style={{ color: theme.text }}>
                  Upper Body Workout
                </Text>
                <Text variant="bodySmall" style={{ color: theme.textSecondary }}>
                  2 hours ago • 45 min
                </Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: theme.primary }]} />
              <View style={styles.activityText}>
                <Text variant="bodyMedium" style={{ color: theme.text }}>
                  Cardio Session
                </Text>
                <Text variant="bodySmall" style={{ color: theme.textSecondary }}>
                  Yesterday • 30 min
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
  },
  goalCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 0,
  },
  goalSubtitle: {
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  actionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  activityCard: {
    borderRadius: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
});
