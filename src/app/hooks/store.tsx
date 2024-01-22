import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { createSlice } from "@reduxjs/toolkit";
import { create } from "domain";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { Action } from "@reduxjs/toolkit";

import { Document } from "../requests";

export const askAISlicer = createSlice({
  name: "askAIHander",
  initialState: true,
  reducers: {
    setAskAI: (state, action) => {
      
      return action.payload.ask as boolean;
    },
  },
});

export const toastSlicer = createSlice({
  name: "toastHandler",
  initialState: [] as Document[],
  reducers: {
    appendToast: (state, action) => {
      return [...state, action.payload.toast as Document];
    },
    removeToast: (state, action) => {
      const remainingToasts = state.filter(
        (item) => item.documentId != action.payload.removedToast.documentId
      );
      return remainingToasts;
    },
  },
});

export const wsNotifySlice = createSlice({
  name: "wsNotifyHandler",
  initialState: {
    documents: [] as Document[],
    loading: true,
    paginatedRecentsDocuments: [] as Document[],
    paginatedAllDocuments: [] as Document[],
  },
  reducers: {
    setDocuments: (state, action) => {
      return {
        documents: action.payload as Document[],
        loading: false,
        paginatedRecentsDocuments: action.payload.slice(0, 5) as Document[],
        paginatedAllDocuments: action.payload.slice(0, 10) as Document[],
      };
    },
    appendDocument: (state, action) => {
      const newDocuments = [
        ...state.documents,
        action.payload.newDocument as Document,
      ];
      const paginatedRecentsDocumentsSize =
        state.paginatedRecentsDocuments.length;
      const paginatedAllDocumentsSize = state.paginatedAllDocuments.length;

      return {
        ...state,
        documents: newDocuments,
        paginatedAllDocuments: newDocuments.slice(0, paginatedAllDocumentsSize),
        paginatedRecentsDocuments: newDocuments.slice(
          0,
          paginatedRecentsDocumentsSize
        ),
      };
    },
    removeADocument: (state, action) => {
      const newDocuments = state.documents.filter(
        (item) => item.documentId != action.payload.removedDocument.documentId
      );
      const paginatedRecentsDocumentsSize =
        state.paginatedRecentsDocuments.length;
      const paginatedAllDocumentsSize = state.paginatedAllDocuments.length;

      return {
        ...state,
        documents: newDocuments,
        paginatedAllDocuments: newDocuments.slice(0, paginatedAllDocumentsSize),
        paginatedRecentsDocuments: newDocuments.slice(
          0,
          paginatedRecentsDocumentsSize
        ),
      };
    },
    setADocument: (state, action) => {
      const newDocuments = state.documents.map((doc) => {
        if (doc.documentId == action.payload.updatedDocument.documentId) {
          return action.payload.updatedDocument;
        } else {
          return doc;
        }
      });

      const paginatedRecentsDocumentsSize =
        state.paginatedRecentsDocuments.length;
      const paginatedAllDocumentsSize = state.paginatedAllDocuments.length;

      return {
        ...state,
        documents: newDocuments,
        paginatedAllDocuments: newDocuments.slice(0, paginatedAllDocumentsSize),
        paginatedRecentsDocuments: newDocuments.slice(
          0,
          paginatedRecentsDocumentsSize
        ),
      };
    },
    setPaginatedRecentsDocuments: (state) => {
      var length = state.paginatedRecentsDocuments.length;
      return {
        ...state,
        paginatedRecentsDocuments: [
          ...state.paginatedRecentsDocuments,
          ...state.documents.slice(length, length + 5),
        ],
      };
    },
    setPaginatedAllDocuments: (state) => {
      var length = state.paginatedAllDocuments.length;
      return {
        ...state,
        paginatedAllDocuments: [
          ...state.paginatedAllDocuments,
          ...state.documents.slice(length, length + 5),
        ],
      };
    },
  },
});



export const navSlice = createSlice({
  name: "navHandler",
  initialState: false,
  reducers: {
    collapse: (state) => {
      return false;
    },
    expand: (state) => {
      return true;
    },
  },
});

export const modalSlice = createSlice({
  name: "modalHandler",
  initialState: false,
  reducers: {
    closeModal: (state) => {
      return false;
    },
    openModal: (state) => {
      return true;
    },
  },
});

export const loginModalSlice = createSlice({
  name: "loginModalHandler",
  initialState: false,
  reducers: {
    closeLogInModal: (state) => {
      return false;
    },
    openLogInModal: (state) => {
      return true;
    },
  },
});

export const { closeModal, openModal } = modalSlice.actions;
export const { collapse, expand } = navSlice.actions;

export const {
  setDocuments,
  setPaginatedRecentsDocuments,
  removeADocument,
  setPaginatedAllDocuments,
  setADocument,
  appendDocument,
} = wsNotifySlice.actions;
export const { appendToast, removeToast } = toastSlicer.actions;
export const { setAskAI } = askAISlicer.actions;
export const { closeLogInModal, openLogInModal } = loginModalSlice.actions;

export const store = configureStore({
  reducer: {
    modalHandler: modalSlice.reducer,
    navHandler: navSlice.reducer,
    wsNotifyHandler: wsNotifySlice.reducer,
    toastHandler: toastSlicer.reducer,
    askAIHandler: askAISlicer.reducer,
    loginModalHandler: loginModalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const isModalOpennable = (state: RootState) => state.modalHandler;
export const isNavOpen = (state: RootState) => state.navHandler;
export const docsState = (state: RootState) => state.wsNotifyHandler;
export const toastState = (state: RootState) => state.toastHandler;
export const askAIState = (state: RootState) => state.askAIHandler;
export const loginState = (state: RootState) => state.loginModalHandler;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
