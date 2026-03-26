// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { message } from "antd";
import { uploadImage } from "../Utils";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/damanorganic/category_list_admin");
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        throw new Error("failed to fetch categories");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "failed to fetch categories",
      );
    }
  },
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async ({ navigate, setLoading, categoryData }, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImage(categoryData.file);
      const response = await api.post("/api/damanorganic/category_add", {
        CategoryName: categoryData.CategoryName,
        Image: imageUrl,
        Description: categoryData.Description,
      });
      if (response.data.code === 200) {
        navigate("/categories");
        setLoading(false);
        return response.data.data.results;
      } else {
        message.error("Failed to add category");
        throw new Error("Failed to add category");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data.message || "Failed to add category");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, updatedData, navigate }, { rejectWithValue }) => {
    try {
      let imageUrl;
      if (updatedData?.file) {
        imageUrl = await uploadImage(updatedData?.file);
      }
      const response = await api.put(
        `/api/damanorganic/category_update/${id}`,
        {
          CategoryName: updatedData.CategoryName,
          Description: updatedData.Description,
          Image: updatedData.file ? imageUrl : updatedData?.image,
        },
      );
      if (response.data.code === 200) {
        navigate("/categories");
        message.success("Successfully updated category");
        return response.data.data.results;
      } else {
        throw new Error("failed to update categories");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "failed to update categories",
      );
    }
  },
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/damanorganic/category/${id}`);
      if (response.data.code === 200) {
        return response.data.data.results;
      } else {
        message.error(`Failed to fetch category details`);
        throw new Error("Failed to fetch slider");
      }
    } catch (error) {
      message.error(
        error.response.data.message || `Failed to fetch slider details`,
      );
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/damanorganic/category_del/${id}`);
      if (response.data.code === 200) {
        return id;
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete category",
      );
    }
  },
);
export const updateCategoryOrder = createAsyncThunk(
  "categories/updateOrder",
  async (reorderedCategories) => {
    const orderedIds = {
      order_json: reorderedCategories.map((c, i) => ({
        CategoryId: c._id,
        order: i,
      })),
    };
    console.log(orderedIds);
    const response = await api.put(
      "/api/damanorganic/categories_updateorder",
      orderedIds,
    );
    if (response.data.code === 200) {
      return response.data.data.results;
    } else {
      throw new Error("Failed to update category order");
    }
  },
);

export const updateCategoryStatus = createAsyncThunk(
  "category/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/damanorganic/category_status_update/${id}`,
        { status },
      );

      if (response.data.code === 200) {
        message.success("Category status updated");
        return response.data.data.results;
      } else {
        throw new Error("Failed to update category status");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update category status",
      );
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  categories: [],
  loading: true,
  error: null,
  categoryDetails: {},
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Clear error state if needed
    clearError: (state) => {
      state.error = null;
    },
    clearCategoryDetails: (state) => {
      state.categoryDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id,
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      // fetch by id
      .addCase(fetchCategoryById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.categoryDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* STATUS */

      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c._id === action.payload._id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Update Categories order
      .addCase(updateCategoryOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateCategoryOrder.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCategoryOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, clearCategoryDetails } = categorySlice.actions;
export default categorySlice.reducer;
