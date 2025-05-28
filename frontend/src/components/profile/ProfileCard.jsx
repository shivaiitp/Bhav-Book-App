import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from "./subcomponents/ProfileHeader";
import ProfileView from "./subcomponents/ProfileView";
import LoadingState from "./subcomponents/ProfileLoadingState";
import { ErrorState, StatusAlert } from "./subcomponents/StatusError";
import { updateProfile, clearUpdateSuccess } from '../../store/slices/profileSlice';

export default function ProfileCard({ profile: externalProfile, isOwnProfile = true }) {
  // Redux state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { loading: profileLoading, updateSuccess, error: profileError } = useSelector((state) => state.profile);

  // Local state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateStatus, setUpdateStatus] = useState({ message: "", type: "" });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // If external profile is provided, use it (for viewing other users)
      if (externalProfile) {
        setProfile(externalProfile);
        setFormData({
          fullName: externalProfile.fullName || "",
          email: externalProfile.email || "",
          phone: externalProfile.phone || "",
          profile: {
            bio: externalProfile.profile?.bio || "",
            emotionStyle: externalProfile.profile?.emotionStyle || "emoji",
            language: externalProfile.profile?.language || "en",
            tone: externalProfile.profile?.tone || "neutral",
            timezone: externalProfile.profile?.timezone || "",
            insightFrequency: externalProfile.profile?.insightFrequency || "weekly",
            avatar: externalProfile.profile?.avatar || null,
            dob: externalProfile.profile?.dob || "",
            gender: externalProfile.profile?.gender || ""
          },
        });
        setLoading(false);
        return;
      }

      // Use Redux user data if available
      if (user) {
        setProfile(user);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          profile: {
            bio: user.profile?.bio || "",
            emotionStyle: user.profile?.emotionStyle || "emoji",
            language: user.profile?.language || "en",
            tone: user.profile?.tone || "neutral",
            timezone: user.profile?.timezone || "",
            insightFrequency: user.profile?.insightFrequency || "weekly",
            avatar: user.profile?.avatar || null,
            dob: user.profile?.dob || "",
            gender: user.profile?.gender || ""
          },
        });
        setLoading(false);
      } else {
        setLoading(false);
        setError("No profile data available");
      }
    };

    fetchProfile();
  }, [externalProfile, user]);

  // Handle Redux update success
  useEffect(() => {
    if (updateSuccess) {
      setUpdateStatus({ message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
      setPhotoPreview(null);
      
      setTimeout(() => {
        setUpdateStatus({ message: "", type: "" });
        dispatch(clearUpdateSuccess());
      }, 5000);
    }
  }, [updateSuccess, dispatch]);

  // Handle Redux profile error
  useEffect(() => {
    if (profileError) {
      setUpdateStatus({ message: profileError, type: "error" });
    }
  }, [profileError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus({ message: "", type: "" });

    if (!formData.fullName?.trim()) {
      setUpdateStatus({ message: "Full name is required", type: "error" });
      return;
    }

    const updateData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone?.trim() || "",
      profile: {
        bio: formData.profile.bio?.trim() || "",
        emotionStyle: formData.profile.emotionStyle,
        language: formData.profile.language,
        tone: formData.profile.tone,
        timezone: formData.profile.timezone,
        insightFrequency: formData.profile.insightFrequency,
        dob: formData.profile.dob,
        gender: formData.profile.gender
      }
    };

    // If there's a file upload, handle it separately
    if (formData.profile.avatar instanceof File) {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', updateData.fullName);
      formDataToSend.append('phone', updateData.phone);
      formDataToSend.append('profile[bio]', updateData.profile.bio);
      formDataToSend.append('profile[emotionStyle]', updateData.profile.emotionStyle);
      formDataToSend.append('profile[language]', updateData.profile.language);
      formDataToSend.append('profile[tone]', updateData.profile.tone);
      formDataToSend.append('profile[timezone]', updateData.profile.timezone);
      formDataToSend.append('profile[insightFrequency]', updateData.profile.insightFrequency);
      formDataToSend.append('profile[dob]', updateData.profile.dob);
      formDataToSend.append('profile[gender]', updateData.profile.gender);
      formDataToSend.append('avatar', formData.profile.avatar);
      
      dispatch(updateProfile({ data: formDataToSend, isFormData: true }));
    } else {
      dispatch(updateProfile({ data: updateData, isFormData: false }));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPhotoPreview(null);
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profile: {
          bio: profile.profile?.bio || "",
          emotionStyle: profile.profile?.emotionStyle || "emoji",
          language: profile.profile?.language || "en",
          tone: profile.profile?.tone || "neutral",
          timezone: profile.profile?.timezone || "",
          insightFrequency: profile.profile?.insightFrequency || "weekly",
          avatar: profile.profile?.avatar || null,
          dob: profile.profile?.dob || "",
          gender: profile.profile?.gender || ""
        }
      });
    }
  };

  const handlePhotoChange = (file, preview) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatar: file
      }
    }));
    setPhotoPreview(preview);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 mt-16">
      {updateStatus.message && <StatusAlert status={updateStatus} />}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <ProfileHeader
          photoUrl={profile.profile?.avatar}
          isEditing={isOwnProfile && isEditing}
          photoPreview={photoPreview}
          onPhotoChange={handlePhotoChange}
          darkMode={darkMode}
        />

        <div className="pt-20 px-6 sm:px-10 pb-8">
          <ProfileView
            profile={profile}
            setIsEditing={setIsEditing}
            isEditing={isOwnProfile && isEditing}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            cancelEdit={cancelEdit}
            isSaving={profileLoading}
            canEdit={isOwnProfile}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}
