import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#2676EF',
  white: '#ffffff',
  black: '#000000',
  yellow: '#FDF60A',
  button: "#FFC261",
  black: "#363636"
};

const style = StyleSheet.create({
  main:{
    flex:1,
    backgroundColor:"white"
  },
  container:{
    flex:1,
    padding:22
  },
  poppinsbold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 27,
    color:"#363636"
  },
  poppinsmedium: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color:"#363636"
  },
  nunitosans: {
    fontFamily: "NunitoSans-Regular",
    fontSize: 16,
    color:"#363636"
  },
  nunitosansemi: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 12,
    color:"gray"
  },
  button: {
    backgroundColor: "#FFC261",
    borderRadius: 50,
    width:112,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: "center",
  },
  line: {
    backgroundColor: 'lightgray',
    height: 1,
    marginTop: 15,
  },
});

export default style;
