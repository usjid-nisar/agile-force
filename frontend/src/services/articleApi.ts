import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Article {
  _id: string;
  title: string;
  content: string;
  description: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

interface ArticleCreate {
  title: string;
  content: string;
  description: string;
  summary: string;
}

interface ArticleUpdate {
  title?: string;
  content?: string;
  description?: string;
  summary?: string;
}

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], void>({
      query: () => '/articles',
      providesTags: ['Article'],
    }),
    getArticle: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: ['Article'],
    }),
    createArticle: builder.mutation<Article, ArticleCreate>({
      query: (article) => ({
        url: '/articles',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Article'],
    }),
    updateArticle: builder.mutation<Article, { id: string; article: ArticleUpdate }>({
      query: ({ id, article }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: ['Article'],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi; 