import { create } from 'zustand';

const useAppStore = create((set) => ({
  // API Key
  apiKey: localStorage.getItem('vibe_api_key') || '',
  setApiKey: (key) => {
    localStorage.setItem('vibe_api_key', key);
    set({ apiKey: key });
  },
  // Navigation
  currentView: 'home', // 'home', 'topic', 'manual', 'editor'
  setCurrentView: (view) => set({ currentView: view }),

  // Input Mode
  inputMode: null, // 'topic' or 'manual'
  setInputMode: (mode) => set({ inputMode: mode, currentView: mode }),

  // Topic Workflow State
  topic: '',
  setTopic: (topic) => set({ topic }),
  
  bundle: null, // Stores research data
  setBundle: (bundle) => set({ bundle }),

  // Manual input workflow
  customTitle: '',
  customText: '',
  customSections: [],
  setCustomTitle: (title) => set({ customTitle: title }),
  setCustomText: (text) => set({ customText: text }),
  setCustomSections: (sections) => set({ customSections: sections }),

  // Template
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  // Spec
  spec: null,
  setSpec: (spec) => set({ spec }),

  // Generated Images
  images: [], // Array of {id, path, filename, page}
  currentImageIndex: 0,
  addImage: (image) => set((state) => ({ images: [...state.images, image] })),
  setImages: (images) => set({ images }),
  setCurrentImageIndex: (index) => set({ currentImageIndex: index }),

  // Multi-page
  pages: [{ id: 1, title: 'Page 1', content: '', imageId: null }],
  currentPageId: 1,
  addPage: () => set((state) => {
    const newId = Math.max(...state.pages.map(p => p.id), 0) + 1;
    return {
      pages: [...state.pages, { id: newId, title: `Page ${newId}`, content: '', imageId: null }],
      currentPageId: newId
    };
  }),
  removePage: (id) => set((state) => ({
    pages: state.pages.filter(p => p.id !== id),
    currentPageId: state.pages[0]?.id || 1
  })),
  updatePage: (id, updates) => set((state) => ({
    pages: state.pages.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  setCurrentPageId: (id) => set({ currentPageId: id }),

  // Logo
  logoFile: null,
  logoUrl: null,
  setLogoFile: (file) => set({ logoFile: file }),
  setLogoUrl: (url) => set({ logoUrl: url }),

  // Loading & Errors
  loading: false,
  error: null,
  loadingMessage: '',
  setLoading: (loading, message = '') => set({ loading, loadingMessage: message, error: null }),
  setError: (error) => set({ error, loading: false }),

  // Reset
  reset: () => set({
    currentView: 'home',
    inputMode: null,
    topic: '',
    bundle: null,
    customTitle: '',
    customText: '',
    customSections: [],
    selectedTemplate: null,
    spec: null,
    images: [],
    currentImageIndex: 0,
    logoFile: null,
    logoUrl: null,
    loading: false,
    error: null,
    loadingMessage: '',
  }),
}));

export default useAppStore;
