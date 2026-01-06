import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Annotation {
  id: string;
  timestamp: number;
  label: string;
  description?: string;
  color?: string;
  metricId?: string;
}

export interface AnnotationsState {
  annotations: Annotation[];
  
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  clearAnnotations: () => void;
  getAnnotationsForRange: (startTime: number, endTime: number) => Annotation[];
}

export const useAnnotationsStore = create<AnnotationsState>()(
  persist(
    (set, get) => ({
      annotations: [],

      addAnnotation: (annotationData) => {
        const annotation: Annotation = {
          ...annotationData,
          id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          color: annotationData.color || '#f59e0b',
        };
        set((state) => ({
          annotations: [...state.annotations, annotation].sort(
            (a, b) => a.timestamp - b.timestamp
          ),
        }));
      },

      updateAnnotation: (id, updates) => {
        set((state) => ({
          annotations: state.annotations.map((annotation) =>
            annotation.id === id ? { ...annotation, ...updates } : annotation
          ),
        }));
      },

      deleteAnnotation: (id) => {
        set((state) => ({
          annotations: state.annotations.filter((annotation) => annotation.id !== id),
        }));
      },

      clearAnnotations: () => {
        set({ annotations: [] });
      },

      getAnnotationsForRange: (startTime, endTime) => {
        return get().annotations.filter(
          (annotation) =>
            annotation.timestamp >= startTime && annotation.timestamp <= endTime
        );
      },
    }),
    {
      name: 'annotations-storage',
    }
  )
);
