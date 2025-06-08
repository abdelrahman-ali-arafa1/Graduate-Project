import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allApologies: [],
  filteredApologies: [],
  selectedApology: null,
  loading: false,
  error: null
};

export const apologySlice = createSlice({
  name: 'apologies',
  initialState,
  reducers: {
    // تحميل كل الاعتذارات
    setAllApologies: (state, action) => {
      state.allApologies = action.payload;
    },
    
    // تعيين الاعتذارات المفلترة
    setFilteredApologies: (state, action) => {
      state.filteredApologies = action.payload;
    },
    
    // تعيين الاعتذار المحدد للعرض التفصيلي
    setSelectedApology: (state, action) => {
      state.selectedApology = action.payload;
    },
    
    // تعيين حالة التحميل
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // تعيين حالة الخطأ
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // تحديث حالة اعتذار معين في القائمة
    updateApologyStatus: (state, action) => {
      const { id, status, reason } = action.payload;
      
      // تحديث في قائمة كل الاعتذارات
      const apologyIndex = state.allApologies.findIndex(apology => apology._id === id);
      if (apologyIndex !== -1) {
        state.allApologies[apologyIndex].status = status;
        if (reason) state.allApologies[apologyIndex].reason = reason;
      }
      
      // تحديث في قائمة الاعتذارات المفلترة
      const filteredIndex = state.filteredApologies.findIndex(apology => apology._id === id);
      if (filteredIndex !== -1) {
        state.filteredApologies[filteredIndex].status = status;
        if (reason) state.filteredApologies[filteredIndex].reason = reason;
      }
      
      // تحديث الاعتذار المحدد إذا كان هو نفس الاعتذار الذي تم تحديثه
      if (state.selectedApology && state.selectedApology._id === id) {
        state.selectedApology.status = status;
        if (reason) state.selectedApology.reason = reason;
      }
    },
    
    // تنقية الاعتذارات بحسب المعايير
    filterApologies: (state, action) => {
      const { statusFilter, searchQuery, departmentFilter, courseFilter, role } = action.payload;
      
      // نبدأ بنسخة من كل الاعتذارات
      let filtered = [...state.allApologies];
      
      // للمدرسين (instructors)، نظهر فقط الاعتذارات المقبولة افتراضيًا
      if (role === 'instructor') {
        filtered = filtered.filter(apology => apology.status === 'accepted');
      }
      
      // فلترة حسب الحالة
      if (statusFilter !== 'all') {
        filtered = filtered.filter(apology => apology.status === statusFilter);
      }
      
      // فلترة حسب البحث
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(apology => 
          apology.student?.name?.toLowerCase().includes(query) || 
          apology.student?.email?.toLowerCase().includes(query) ||
          (role === 'instructor' && apology.course?.courseName?.toLowerCase().includes(query))
        );
      }
      
      // فلترة حسب القسم (للإدارة فقط)
      if (role === 'admin' && departmentFilter !== 'all') {
        filtered = filtered.filter(apology => 
          apology.student?.department?.toUpperCase() === departmentFilter.toUpperCase()
        );
      }
      
      // فلترة حسب المقررات الدراسية (للمدرسين فقط)
      if (role === 'instructor' && courseFilter !== 'all') {
        filtered = filtered.filter(apology => 
          apology.course?.courseName?.toLowerCase().includes(courseFilter.toLowerCase())
        );
      }
      
      state.filteredApologies = filtered;
    },
    
    // إعادة تعيين حالة شريحة الاعتذارات
    resetApologyState: () => initialState
  }
});

export const { 
  setAllApologies,
  setFilteredApologies,
  setSelectedApology,
  setLoading,
  setError,
  updateApologyStatus,
  filterApologies,
  resetApologyState
} = apologySlice.actions;

export default apologySlice.reducer; 