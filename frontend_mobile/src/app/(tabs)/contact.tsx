import { useCallback, useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Phone, MapPin, Send } from "lucide-react-native";
import { useRouter } from "expo-router";
import Header from "../../components/homepage/Header";
import ContactInfoCard from "../../components/contactpage/ContactInfoCard";
import ContactInput from "../../components/contactpage/ContactInput";
import { useTheme } from "../../context/useTheme";
import { useInbox } from "../../context/InboxContext";
import { usePopup } from "../../components/Popup";
import { useResponsiveContainer, useResponsiveFontSize, useResponsiveColumns, gridCellStyle } from "../../utils/responsive";

export default function ContactScreen() {
  const { colors } = useTheme();
  const { addMessage } = useInbox();
  const { showToast } = usePopup();
  const router = useRouter();
  const headerContainer = useResponsiveContainer();
  const infoContainer = useResponsiveContainer();
  const formContainer = useResponsiveContainer();
  const infoColumns = useResponsiveColumns(300, 1);
  const titleSize = useResponsiveFontSize(40);
  const buttonTextSize = useResponsiveFontSize(16, 0.92, 1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const mountedRef = useRef(true);


  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Invalid email format";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, subject, message]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await addMessage({ name, email, subject, message });
      if (!mountedRef.current) return;
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
      showToast({
        type: "success",
        message: "Message sent successfully!",
        variant: "filled",
        duration: 2800,
      });
    } catch {
      if (!mountedRef.current) return;
      setLoading(false);
      showToast({
        type: "error",
        message: "Something went wrong. Please try again.",
        variant: "filled",
        duration: 2800,
      });
    }
  }, [validate, name, email, subject, message, addMessage, showToast]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve();
    if (mountedRef.current) setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header />

        <View style={[headerContainer, { paddingHorizontal: 20, paddingTop: 32, gap: 8 }]}>
          <Text className="text-xs font-bold tracking-[2px]" style={{ color: colors.primary }}>
            CONTACT
          </Text>
          <Text className="font-bold" style={{ color: colors.text, fontSize: titleSize, lineHeight: Math.round(titleSize * 1.1) }}>
            Let's talk
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.secondaryText }}>
            For project work, collaborations, and speaking. I read every message and reply within two business days.
          </Text>
        </View>

        <View style={[infoContainer, { paddingHorizontal: 20, paddingTop: 32, flexDirection: "row", flexWrap: "wrap", rowGap: 20 }]}>
          <View style={gridCellStyle(infoColumns, 20)}>
            <ContactInfoCard
              icon={<Mail size={20} color={colors.primary} />}
              label="EMAIL"
              value="anishshrestha@gmail.com"
            />
          </View>
          <View style={gridCellStyle(infoColumns, 20)}>
            <ContactInfoCard
              icon={<Phone size={20} color={colors.primary} />}
              label="PHONE"
              value="+977 9812345678"
            />
          </View>
          <View style={gridCellStyle(infoColumns, 20)}>
            <ContactInfoCard
              icon={<MapPin size={20} color={colors.primary} />}
              label="BASED IN"
              value="Dharan, Nepal"
            />
          </View>
        </View>

        <View style={[formContainer, { paddingHorizontal: 20, marginTop: 32, marginBottom: 40 }]}>
          <View
            style={[
              {
                padding: 24,
                gap: 20,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 24,
              },
            ]}
          >
          <ContactInput
            label="Name"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            placeholder="Your name"
            autoCapitalize="words"
            error={errors.name}
          />
          <ContactInput
            label="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <ContactInput
            label="Subject"
            value={subject}
            onChangeText={(t) => { setSubject(t); setErrors((e) => ({ ...e, subject: undefined })); }}
            placeholder="What's this about?"
            error={errors.subject}
          />
          <ContactInput
            label="Message"
            value={message}
            onChangeText={(t) => { setMessage(t); setErrors((e) => ({ ...e, message: undefined })); }}
            placeholder="Your message..."
            multiline
            numberOfLines={6}
            error={errors.message}
          />

          <TouchableOpacity
            className="flex-row items-center justify-center h-15 rounded-full gap-2"
            style={{ backgroundColor: colors.primary, height: 60, borderRadius: 999 }}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <Text className="font-bold" style={{ color: colors.text, fontSize: buttonTextSize }}>Send message</Text>
                <Send size={18} color={colors.text} />
              </>
            )}
          </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});