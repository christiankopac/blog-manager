import { defineStore } from "pinia";
import {
	fetchPosts,
	createPost,
	updatePost,
	deletePost as apiDeletePost,
} from "../api/posts";
import { fetchUsers } from "../api/users";
import type { Post, User, CreatePostData, UpdatePostData } from "../types";
import { useToastStore } from "./toast";
import type { StoreGeneric } from 'pinia'

interface PostsState {
	posts: Post[];
	users: User[];
	isLoading: boolean;
	error: string | null;
	pendingOperations: Set<number>;
	lastAction: string;
}

export interface PostsStore extends StoreGeneric {
	posts: Post[];
	users: User[];
	error: string | null;
	isLoading: boolean;
	fetchData: () => Promise<void>;
	savePost: (post: CreatePostData & { id?: number }) => Promise<boolean>;
	deletePost: (id: number) => Promise<boolean>;
	deletePosts: (ids: number[]) => Promise<void>;
	getPostsBySearch: (query: string) => Post[];
	getUserName: (userId: number) => string;
	isPostPending: (postId: number) => boolean;
}


export const usePostsStore = defineStore("posts", {
	state: (): PostsState => ({
		posts: [],
		users: [],
		isLoading: false,
		error: null,
		pendingOperations: new Set(),
		lastAction: "",
	}),

	getters: {
		getPostsBySearch: (state) => {
			return (query: string) => {
				const searchQuery = query.toLowerCase();
				return state.posts.filter((post) =>
					post.title.toLowerCase().includes(searchQuery)
				);
			};
		},

		getUserName: (state) => {
			const userMap = new Map(state.users.map((user) => [user.id, user.name]));
			return (userId: number) => userMap.get(userId) ?? "Unknown";
		},

		isPostPending: (state) => (postId: number) =>
			state.pendingOperations.has(postId),

		getLastAction: (state) => state.lastAction,
	},

	actions: {
		async fetchData() {
			this.isLoading = true;
			this.error = null;
			this.lastAction = "Fetching data";
			const toast = useToastStore();

			try {
				const [postsData, usersData] = await Promise.all([fetchPosts(), fetchUsers()]);
				this.posts = postsData;
				this.users = usersData;
				this.lastAction = "Data fetched successfully";
			} catch (error) {
				this.error = "Failed to load data. Please try again.";
				this.lastAction = "Error fetching data";
				toast.error(this.error);
			} finally {
				this.isLoading = false;
			}
		},

		async savePost(postData: CreatePostData & { id?: number }) {
			const { id } = postData;
			const isUpdate = !!id;
			const tempId = isUpdate ? id : -Date.now();
			this.pendingOperations.add(tempId);
			const toast = useToastStore();

			this.lastAction = isUpdate ? "Updating post" : "Creating new post";

			if (isUpdate) {
				const index = this.posts.findIndex((p) => p.id === id);
				if (index === -1) {
					this.pendingOperations.delete(tempId);
					this.lastAction = "Post not found for update";
					toast.error(this.lastAction);
					return false;
				}

				const originalPost = { ...this.posts[index] };

				try {
					const response = await updatePost(id, postData as UpdatePostData);
					const updated = response as Post;
					this.posts = [
						...this.posts.slice(0, index),
						updated,
						...this.posts.slice(index + 1),
					];
					this.lastAction = "Post updated successfully";
					toast.success(this.lastAction);
					return true;
				} catch (error) {
					this.posts = [
						...this.posts.slice(0, index),
						originalPost,
						...this.posts.slice(index + 1),
					];
					this.error = "Failed to update post. Changes have been reverted.";
					toast.error(this.error);
					return false;
				} finally {
					this.pendingOperations.delete(tempId);
				}
			} else {
				const tempPost = { id: tempId, ...postData } as Post;
				this.posts.unshift(tempPost);

				try {
					const created = await createPost(postData);
					const index = this.posts.findIndex((p) => p.id === tempId);
					if (index !== -1) {
						this.posts[index] = created as Post;
					}
					this.lastAction = "Post created successfully";
					toast.success(this.lastAction);
					return true;
				} catch (error) {
					this.posts = this.posts.filter((p) => p.id !== tempId);
					this.error = "Failed to create post. Please try again.";
					toast.error(this.error);
					return false;
				} finally {
					this.pendingOperations.delete(tempId);
				}
			}
		},

		async deletePosts(ids: number[]) {
			const toast = useToastStore();
			const originalPosts = [...this.posts];
			const totalPosts = ids.length;
			
			this.posts = this.posts.filter(p => !ids.includes(p.id));
			
			try {
				let successCount = 0;
				let failedCount = 0;
				const toastId = totalPosts > 1 ? toast.showPersistent(`Deleting posts: 0/${totalPosts}`) : undefined;
				
				for (const id of ids) {
					this.pendingOperations.add(id);
					try {
						await apiDeletePost(id);
						successCount++;
						if (toastId && totalPosts > 1) {
							this.lastAction = `Deleting posts: ${successCount}/${totalPosts}`;
							toast.update(toastId, this.lastAction);
						}
					} catch (error) {
						this.error = `Failed to delete post ${id}`;
						toast.error(this.error);
						failedCount++;
					} finally {
						this.pendingOperations.delete(id);
					}
				}
				
				if (toastId) {
					toast.dismiss(toastId);
				}
				
				if (successCount > 0) {
					this.lastAction = `Operation completed. ${successCount} post${successCount !== 1 ? 's' : ''} deleted successfully.`;
					toast.success(this.lastAction);
				}
				
				if (failedCount > 0) {
					const failedIds = ids.slice(successCount);
					this.posts = [
						...this.posts,
						...originalPosts.filter(p => failedIds.includes(p.id))
					];
					this.error = `Failed to delete ${failedCount} post${failedCount !== 1 ? 's' : ''}.`;
					toast.error(this.error);
				}
				
				return successCount > 0;
			} catch (error) {
				this.posts = originalPosts;
				this.error = "Failed to delete posts. Please try again.";
				toast.error(this.error);
				return false;
			}
		},

		async deletePost(id: number) {
			const postIndex = this.posts.findIndex((p) => p.id === id);
			if (postIndex === -1) {
				this.lastAction = "Post not found for deletion";
				return false;
			}

			const deletedPost = this.posts[postIndex];
			this.pendingOperations.add(id);
			this.posts.splice(postIndex, 1);
			const toastStore = useToastStore();

			try {
				await apiDeletePost(id);
				this.lastAction = "Post deleted successfully";
				toastStore.success(this.lastAction);
				return true;
			} catch (error) {
				this.posts.splice(postIndex, 0, deletedPost);
				this.error = "Failed to delete post. Post has been restored.";
				toastStore.error(this.error);
				return false;
			} finally {
				this.pendingOperations.delete(id);
			}
		},
	},
}) as unknown as () => PostsStore
