import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text, Avatar, Divider } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

interface DrawerContentProps {
  onClose: () => void;
}

export default function DrawerContent({ onClose }: DrawerContentProps) {
  const theme = useTheme();

  const menuItems = [
    { icon: 'home', title: 'Home', onPress: () => console.log('Home pressed') },
    { icon: 'dumbbell', title: 'Workouts', onPress: () => console.log('Workouts pressed') },
    { icon: 'calendar', title: 'Sessions', onPress: () => console.log('Sessions pressed') },
    { icon: 'target', title: 'Exercises', onPress: () => console.log('Exercises pressed') },
    { icon: 'chart-line', title: 'Progress', onPress: () => console.log('Progress pressed') },
    { icon: 'cog', title: 'Settings', onPress: () => console.log('Settings pressed') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Text size={60} label="GT" style={{ backgroundColor: theme.primary }} />
        <View style={styles.profileInfo}>
          <Text variant="headlineSmall" style={{ color: theme.text }}>
            Gym Tracker
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.textSecondary }}>
            user@example.com
          </Text>
        </View>
      </View>

      <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <List.Item
            key={index}
            title={item.title}
                        left={(props) => <List.Icon {...props} icon={item.icon} />}
            onPress={() => {
              item.onPress();
              onClose();
            }}
            style={[styles.menuItem, { backgroundColor: theme.surface }]}
            titleStyle={{ color: theme.text }}
            descriptionStyle={{ color: theme.textSecondary }}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <List.Item
          title="Logout"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={() => console.log('Logout pressed')}
          style={[styles.menuItem, { backgroundColor: theme.surface }]}
          titleStyle={{ color: theme.error }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  divider: {
    marginHorizontal: 16,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
