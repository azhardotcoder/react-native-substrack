import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const SubscriptionModal = ({ visible, subscription, onDismiss, onUpdate }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          {/* Modal content */}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
});

export default SubscriptionModal; 