import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    circleTopShape: {
        position: 'absolute',
        top: -300,
        width: 500,
        height: 595,
        borderRadius: 300,
        backgroundColor: COLORS.purpleGradient,
        alignSelf: 'center',
        overflow: 'hidden',
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8
    },
    circleBottomShape: {
        position: 'absolute',
        bottom: -300,
        width: 500,
        height: 600,
        borderRadius: 300,
        backgroundColor: COLORS.blueLight,
        alignSelf: 'center',
        overflow: 'hidden',
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8
    },
    logoSection: {
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 10,
        color: COLORS.dark,
    },
    form: {
        width: '100%',
        padding: 0,
        borderRadius: 0,
    },
    
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.purpleGradient,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginBottom: 20,
        padding: 4
    },
    inputIcon: {
        marginRight: 10,
        color: COLORS.grey,
    },
    input: {
        flex: 1,
        height: 45,
    },
    eyeIcon: {
        marginLeft: 10,
        color: COLORS.grey,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    remember: {
        fontSize: 14,
        color: COLORS.grey
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    forgot: {
        fontSize: 14,
        marginTop: 10,
    },
    loginButton: {
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginTop:10,
        overflow: 'hidden', 
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 6,
    },
    loginButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: 18,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey,
    },
    orText: {
        marginHorizontal: 10,
        color: COLORS.grey,
        fontSize: 16,
    },
    social:{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
    },
    socialButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: 8,
        padding: 10,
        width: 60,
        height: 60,
        marginHorizontal: 10,
    },
    socialIcon: {
        marginRight: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: 30,
    },
    signupWrapper: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
});

export default styles;
