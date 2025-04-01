import { StyleSheet } from 'react-native';

// App Color Constants
const COLORS = {
  primary: '#1A237E',     // Deep Indigo
  secondary: '#303F9F',   // Indigo
  background: '#F5F6FA',  // Light Gray-Blue
  inputBg: '#FFFFFF',     // Pure White
  dark: '#2C3E50',       // Dark Blue-Gray
  accent: '#3949AB',     // Bright Indigo
  error: '#E53935',      // Elegant Red
  header: '#1A237E',     // Deep Indigo
  text: '#34495E',       // Softer Dark Blue
  border: '#E8EAF6',     // Light Indigo
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  contentContainer: {
    flexGrow: 1,
    marginTop: 20,
    paddingBottom: 20,
  },
  formContainer: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    marginTop: 0,
    backgroundColor: COLORS.header,
    padding: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subHeader: {
    backgroundColor: COLORS.primary,
    padding: 12,
    marginBottom: 12,
  },
  subHeaderTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: COLORS.dark,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  dateFieldContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  dateContainer: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    minHeight: 60,
  },
  dateLabel: {
    fontSize: 13,
    color: COLORS.dark,
    marginBottom: 2,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.dark,
    marginTop: 2,
  },
  dateChangeButton: {
    color: COLORS.accent,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.inputBg,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  requiredStar: {
    color: COLORS.error,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 12,
    opacity: 0.3,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  segmentedButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  segmentedButton: {
    flex: 1,
    minWidth: '30%',
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedSegmentedButton: {
    backgroundColor: COLORS.header,
  },
  segmentedButtonLabel: {
    fontSize: 14,
    color: COLORS.dark,
  },
  selectedSegmentedButtonLabel: {
    color: '#FFFFFF',
  },
  dropdownButton: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  dropdownButtonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  menuContent: {
    backgroundColor: COLORS.inputBg,
    marginTop: 4,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    height: 48,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  changeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialog: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 8,
  },
  dialogTitle: {
    fontSize: 20,
    color: COLORS.dark,
    textAlign: 'center',
    fontWeight: '600',
  },
  dialogText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 8,
  },
  dialogButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dialogButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 