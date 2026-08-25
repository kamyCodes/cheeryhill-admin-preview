



// import axios from "axios";
// import toast from "react-hot-toast";   // Add this import if not already present

// const base_url = "https://investmentwebsite-backend.onrender.com";

// // ------------------- MAIN API CLIENT -------------------
// export const apiClient = axios.create({
//   baseURL: base_url,
//   headers: { "Content-Type": "application/json" },
// });

// // Request Interceptor - Attach Token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn(`⚠️ No token for request: ${config.url}`);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor - Handle Invalid Token / 401
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       const message = error.response?.data?.message || "";
//       if (message.toLowerCase().includes("invalid token") || message.toLowerCase().includes("unauthorized")) {
//         console.error("🚨 Invalid token detected - logging out");
//         localStorage.removeItem("token");
//         localStorage.removeItem("admin");
//         toast.error("Session expired. Please login again.");
//         window.location.href = "/login";   // Force redirect
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ------------------- AUTH -------------------

// export const loginAdmin = async ({ email, password }) => {
//   try {
//     const res = await apiClient.post("/api/v1/auth/login", { email, password });

//     // The network res shows the object is "admin", not "user"
//     const { token, admin } = res.data.data; 

//     if (!token) throw new Error("No token received");

//     localStorage.setItem("token", token);
//     localStorage.setItem("admin", JSON.stringify(admin));

//     return { token, admin }; // Return 'admin' specifically
//   } catch (err) {
//     throw err;
//   }
// };




import axios from "axios";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_API_URL || "https://cherry.dealdrivetechnology.com";

// ------------------- MAIN API CLIENT -------------------

export const apiClient = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json", // <--- THIS IS THE PROBLEM
  },
});

// ------------------- REQUEST INTERCEPTOR -------------------

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Skip attaching token for login route
    if (token && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------- RESPONSE INTERCEPTOR -------------------

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";

      if (
        message.toLowerCase().includes("invalid token") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        console.error("🚨 Session expired");

        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        toast.error("Session expired. Please login again.");

        window.location.href = "/login-in";
      }
    }

    return Promise.reject(error);
  }
);

// ------------------- AUTH SERVICE -------------------

export const loginAdmin = async ({ email, password }) => {
  const res = await apiClient.post("/api/v1/auth/login", {
    email,
    password,
  });

  const { token, admin } = res.data.data;

  if (!token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("admin", JSON.stringify(admin));

  return { token, admin };
};



// ------------------- ADMIN MANAGEMENT -------------------

// Fetch all admins
export const getAdmins = async () => {
  const res = await apiClient.get("/api/v1/admin/admins");
  return res.data.data;
};

// Create new admin
export const createAdmin = async (adminData) => {
  const res = await apiClient.post("/api/v1/admin/admins", adminData);
  return res.data.data;
};

// Update admin details
export const updateAdmin = async (id, updateData) => {
  const res = await apiClient.put(`/api/v1/admin/admins/${id}`, updateData);
  return res.data.data;
};

// Toggle admin active status
export const toggleAdminStatus = async (id) => {
  const res = await apiClient.patch(`/api/v1/admin/admins/${id}/toggle-status`);
  return res.data.data;
};

// Delete admin (based on standard REST, though you provided PUT/PATCH mostly)
export const deleteAdmin = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/admins/${id}`);
  return res.data;
};




// ------------------- SERVICES MANAGEMENT -------------------

export const getAllServices = async () => {
  const res = await apiClient.get("/api/v1/admin/services");
  return res.data.data;
};

export const createService = async (serviceData) => {
  const res = await apiClient.post("/api/v1/admin/services", serviceData);
  return res.data.data;
};

export const updateService = async (id, updateData) => {
  const res = await apiClient.put(`/api/v1/admin/services/${id}`, updateData);
  return res.data.data;
};

export const deleteService = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/services/${id}`);
  return res.data;
};

export const toggleServiceStatus = async (id) => {
  const res = await apiClient.patch(`/api/v1/admin/services/${id}/toggle-status`);
  return res.data.data;
};





// ------------------- TESTIMONIALS MANAGEMENT -------------------

export const getAllTestimonials = async () => {
  const res = await apiClient.get("/api/v1/admin/testimonials");
  return res.data.data;
};

export const createTestimonial = async (data) => {
  const res = await apiClient.post("/api/v1/admin/testimonials", data);
  return res.data.data;
};


export const updateTestimonial = async (id, data) => {
  const res = await apiClient.put(`/api/v1/admin/testimonials/${id}`, data);
  return res.data.data;
};


// export const updateTestimonial = async (id, data) => {
//   const res = await apiClient.put(`/api/v1/admin/testimonials/${id}`, data);
//   return res.data.data;
// };

export const deleteTestimonial = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/testimonials/${id}`);
  return res.data;
};

export const approveTestimonial = async (id) => {
  const res = await apiClient.patch(`/api/v1/admin/testimonials/${id}/approve`);
  return res.data.data;
};





// ------------------- WEBINARS MANAGEMENT -------------------

export const getAllWebinars = async () => {
  const res = await apiClient.get("/api/v1/admin/webinars");
  return res.data.data;
};

export const createWebinar = async (data) => {
  const res = await apiClient.post("/api/v1/admin/webinars", data);
  return res.data.data;
};

export const updateWebinar = async (id, data) => {
  const res = await apiClient.put(`/api/v1/admin/webinars/${id}`, data);
  return res.data.data;
};

export const deleteWebinar = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/webinars/${id}`);
  return res.data;
};



// ------------------- PRESS RELEASE MANAGEMENT -------------------

export const getAllPressReleases = async () => {
  const res = await apiClient.get("/api/v1/admin/press-releases");
  return res.data.data;
};

export const createPressRelease = async (data) => {
  const res = await apiClient.post("/api/v1/admin/press-releases", data);
  return res.data.data;
};

export const updatePressRelease = async (id, data) => {
  const res = await apiClient.put(`/api/v1/admin/press-releases/${id}`, data);
  return res.data.data;
};

export const deletePressRelease = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/press-releases/${id}`);
  return res.data;
};



// ------------------- FAQ MANAGEMENT -------------------

export const getAllFAQs = async () => {
  const res = await apiClient.get("/api/v1/admin/faqs");
  return res.data.data;
};

export const createFAQ = async (data) => {
  const res = await apiClient.post("/api/v1/admin/faqs", data);
  return res.data.data;
};

export const updateFAQ = async (id, data) => {
  const res = await apiClient.put(`/api/v1/admin/faqs/${id}`, data);
  return res.data.data;
};

export const deleteFAQ = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/faqs/${id}`);
  return res.data;
};


// ------------------- CONTACTS/INQUIRIES MANAGEMENT -------------------

export const getAllContacts = async () => {
  const res = await apiClient.get("/api/v1/admin/contacts");
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await apiClient.get("/api/v1/admin/contacts/unread-count");
  return res.data.data.count;
};

export const markAsRead = async (id) => {
  const res = await apiClient.patch(`/api/v1/admin/contacts/${id}/read`);
  return res.data;
};

export const replyToContact = async (id, replyData) => {
  const res = await apiClient.patch(`/api/v1/admin/contacts/${id}/reply`, replyData);
  return res.data;
};

export const deleteContact = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/contacts/${id}`);
  return res.data;
};


// ------------------- LEADERSHIP MANAGEMENT -------------------

// ------------------- LEADERSHIP MANAGEMENT -------------------

export const getAllLeadership = async () => {
  const res = await apiClient.get("/api/v1/admin/leadership");
  return res.data.data;
};

export const createLeadership = async (data) => {
  // We add the config object as the second argument for POST
  const res = await apiClient.post("/api/v1/admin/leadership", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateLeadership = async (id, data) => {
  // We add the config object as the third argument for PUT
  const res = await apiClient.put(`/api/v1/admin/leadership/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteLeadership = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/leadership/${id}`);
  return res.data;
};


// ------------------- AWARDS MANAGEMENT -------------------

export const getAllAwards = async () => {
  const res = await apiClient.get("/api/v1/admin/awards");
  return res.data.data;
};

export const createAward = async (data) => {
  const res = await apiClient.post("/api/v1/admin/awards", data);
  return res.data.data;
};

export const updateAward = async (id, data) => {
  const res = await apiClient.put(`/api/v1/admin/awards/${id}`, data);
  return res.data.data;
};

export const deleteAward = async (id) => {
  const res = await apiClient.delete(`/api/v1/admin/awards/${id}`);
  return res.data;
};

// ------------------- COMPANY INFO MANAGEMENT -------------------

export const getCompanyInfo = async () => {
  const res = await apiClient.get("/api/v1/admin/company-info");
  return res.data.data;
};

export const updateCompanyInfo = async (data) => {
  // Use PUT for general info (Name, Vision, Logo, etc.)
  const res = await apiClient.put("/api/v1/admin/company-info", data);
  return res.data.data;
};

// From your apiServices:
export const updateCompanyStats = async (statsData) => {
  // Pass statsData directly so the fields sit flat on the request body
  const res = await apiClient.patch("/api/v1/admin/company-info/stats", statsData);
  return res.data;
};


export const getDashboardSummary = async () => {
  const [info, unread, team, awards] = await Promise.all([
    getCompanyInfo(),
    getUnreadCount(),
    getAllLeadership(),
    getAllAwards()
  ]);
  
  return {
    stats: info.stats, // Contains live assetsManaged and clients
    unreadInquiries: unread,
    teamSize: team.length,
    awardCount: awards.length,
    lastUpdated: info.updatedAt
  };
};




