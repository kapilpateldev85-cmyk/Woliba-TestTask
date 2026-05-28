import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  completeUserRegistration,
  getWellbeingPillars,
  viewWellnessInterest,
  saveUserDetailsAndSendOtp,
  verifyCompanyNameAndPassword,
  verifyOtpForUserRegistration,
} from "../services/companyService";

export const verifyCompany = createAsyncThunk(
  "registration/verifyCompany",
  async (formData, { rejectWithValue }) => {
    try {
      return await verifyCompanyNameAndPassword(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveUserDetails = createAsyncThunk(
  "registration/saveUserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      return await saveUserDetailsAndSendOtp(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "registration/verifyOtp",
  async (formData, { rejectWithValue }) => {
    try {
      return await verifyOtpForUserRegistration(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWellnessInterests = createAsyncThunk(
  "registration/fetchWellnessInterests",
  async (_, { rejectWithValue }) => {
    try {
      return await viewWellnessInterest();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWellbeingPillars = createAsyncThunk(
  "registration/fetchWellbeingPillars",
  async (_, { rejectWithValue }) => {
    try {
      return await getWellbeingPillars();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "registration/registerUser",
  async (registrationData, { rejectWithValue }) => {
    try {
      return await completeUserRegistration(registrationData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  company: null,
  userDetails: null,
  loginCredentials: null,
  selectedInterests: [],
  selectedWellbeingPillars: [],
  otpToken: "",
  companyStep: {
    loading: false,
    error: "",
    success: false,
  },
  userStep: {
    loading: false,
    error: "",
    success: false,
    message: "",
  },
  otpStep: {
    loading: false,
    error: "",
    success: false,
    message: "",
  },
  interestsStep: {
    interests: [],
    loading: false,
    error: "",
  },
  wellbeingPillarsStep: {
    pillars: [],
    loading: false,
    error: "",
  },
  completionStep: {
    loading: false,
    error: "",
    success: false,
    message: "",
    authToken: "",
    user: null,
  },
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    clearRegistrationStatus: (state) => {
      state.companyStep.error = "";
      state.companyStep.success = false;
    },
    clearUserDetailsStatus: (state) => {
      state.userStep.error = "";
      state.userStep.success = false;
      state.userStep.message = "";
    },
    clearOtpStatus: (state) => {
      state.otpStep.error = "";
      state.otpStep.success = false;
      state.otpStep.message = "";
    },
    saveLoginCredentials: (state, action) => {
      state.loginCredentials = action.payload;
    },
    saveSelectedInterests: (state, action) => {
      state.selectedInterests = action.payload;
    },
    saveSelectedWellbeingPillars: (state, action) => {
      state.selectedWellbeingPillars = action.payload;
    },
    clearCompletionStatus: (state) => {
      state.completionStep.error = "";
      state.completionStep.success = false;
      state.completionStep.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCompany.pending, (state) => {
        state.companyStep.loading = true;
        state.companyStep.error = "";
        state.companyStep.success = false;
      })
      .addCase(verifyCompany.fulfilled, (state, action) => {
        state.companyStep.loading = false;
        state.companyStep.success = true;
        state.company = action.payload?.data?.[0] || null;
      })
      .addCase(verifyCompany.rejected, (state, action) => {
        state.companyStep.loading = false;
        state.companyStep.error = action.payload || "Unable to verify company.";
      })
      .addCase(saveUserDetails.pending, (state) => {
        state.userStep.loading = true;
        state.userStep.error = "";
        state.userStep.success = false;
      })
      .addCase(saveUserDetails.fulfilled, (state, action) => {
        state.userStep.loading = false;
        state.userStep.success = true;
        state.userStep.message =
          action.payload?.data?.message || "Please enter any dummy OTP to continue.";
        state.otpToken = action.payload?.data?.token || "";
        state.userDetails = action.meta.arg;
      })
      .addCase(saveUserDetails.rejected, (state, action) => {
        state.userStep.loading = false;
        state.userStep.error = action.payload || "Unable to send OTP.";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.otpStep.loading = true;
        state.otpStep.error = "";
        state.otpStep.success = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpStep.loading = false;
        state.otpStep.success = true;
        state.otpStep.message =
          action.payload?.data || "OTP verified successfully.";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStep.loading = false;
        state.otpStep.error = action.payload || "Unable to verify OTP.";
      })
      .addCase(fetchWellnessInterests.pending, (state) => {
        state.interestsStep.loading = true;
        state.interestsStep.error = "";
      })
      .addCase(fetchWellnessInterests.fulfilled, (state, action) => {
        state.interestsStep.loading = false;
        state.interestsStep.interests = action.payload?.data || [];
      })
      .addCase(fetchWellnessInterests.rejected, (state, action) => {
        state.interestsStep.loading = false;
        state.interestsStep.error =
          action.payload || "Unable to load wellness interests.";
      })
      .addCase(fetchWellbeingPillars.pending, (state) => {
        state.wellbeingPillarsStep.loading = true;
        state.wellbeingPillarsStep.error = "";
      })
      .addCase(fetchWellbeingPillars.fulfilled, (state, action) => {
        state.wellbeingPillarsStep.loading = false;
        state.wellbeingPillarsStep.pillars = action.payload?.data || [];
      })
      .addCase(fetchWellbeingPillars.rejected, (state, action) => {
        state.wellbeingPillarsStep.loading = false;
        state.wellbeingPillarsStep.error =
          action.payload || "Unable to load wellbeing pillars.";
      })
      .addCase(registerUser.pending, (state) => {
        state.completionStep.loading = true;
        state.completionStep.error = "";
        state.completionStep.success = false;
        state.completionStep.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.completionStep.loading = false;
        state.completionStep.success = true;
        state.completionStep.message =
          action.payload?.message ||
          action.payload?.data?.message ||
          "Registration completed successfully.";
        state.completionStep.authToken = action.payload?.data?.token || "";
        state.completionStep.user = action.payload?.data?.user || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.completionStep.loading = false;
        state.completionStep.error =
          action.payload || "Unable to complete registration.";
      });
  },
});

export const {
  clearCompletionStatus,
  clearOtpStatus,
  clearRegistrationStatus,
  clearUserDetailsStatus,
  saveLoginCredentials,
  saveSelectedInterests,
  saveSelectedWellbeingPillars,
} = registrationSlice.actions;
export default registrationSlice.reducer;
