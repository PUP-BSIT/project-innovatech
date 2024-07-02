import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunityService } from '../../services/community-service.service';
import { LoginAuthentication } from '../../services/login-authentication.service';
import { UserService } from '../../services/user-service.service';
import { ShareCommunityService } from '../../services/share-community.service';
import { Post } from '../../model/posts';
import { Comment } from '../../model/comments';
import { Router } from '@angular/router';
import { Recipe } from '../../model/recipe'; 

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  @ViewChild('postDetailTemplate') postDetailTemplate: TemplateRef<any>;
  dialogRef: MatDialogRef<any>;
  newPostText: string = '';
  newPostImage: File | null = null;
  newPostImageSrc: string | null = null;
  newCommentText: string = '';
  posts: Post[] = [];
  currentPost: Post | null = null;
  newRecipeId: number | null = null;
  newRecipe: Recipe | null = null; 

  constructor(
    public dialog: MatDialog,
    private communityService: CommunityService,
    private loginAuthService: LoginAuthentication,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private shareCommunity: ShareCommunityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.shareCommunity.sharedRecipe$.subscribe(recipe => {
      if (recipe) {
        this.newRecipe = recipe; 
        this.populatePostWithRecipe(recipe);
      }
    });
  }

  populatePostWithRecipe(recipe: Recipe): void {
    console.log('Received recipe:', recipe);
    console.log('this recipe:', this.newRecipe);
    
    this.newPostText = recipe.name;
    this.newRecipeId = recipe.id;
    console.log('this recipe after:',  this.newRecipeId);
    if (recipe.picture) {
      this.newPostImageSrc = !recipe.picture.startsWith('data:image/') 
        ? `data:image/jpeg;base64,${recipe.picture}` 
        : recipe.picture;
    } else {
      this.newPostImageSrc = null;
    }
  }

  loadPosts(): void {
    this.communityService.getPosts().subscribe(
      (response: any) => {
        if (response.success) {
          this.posts = response.posts.map(post => {
            post.recipeId = post.recipeId || post.newRecipeId || post.recipe_id;
            return post;
          });
        } else {
          console.error('Error fetching posts:', response.message);
        }
      },
    );
  }

  openPostDetail(post: Post, template: TemplateRef<any>): void {
    post.recipeId = post.recipeId || this.newRecipeId;
    console.log('Opening post detail:', post);
    this.currentPost = post;
    this.dialogRef = this.dialog.open(template, {
      data: { post },
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
  }

  navigateToRecipe(post: Post, event: Event): void {
    event.stopPropagation(); 
    console.log("-->",post.recipeId);
    if (post.recipeId) {
      this.router.navigate(['/recipe-details', post.recipeId]);
    }
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  likePost(post: Post, event: Event): void {
    event.stopPropagation();
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
  }

  commentOnPost(post: Post, event: Event): void {
    event.stopPropagation();
    this.openPostDetail(post, this.postDetailTemplate);
  }

  toggleLike(comment: Comment): void {
    comment.liked = !comment.liked;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newPostImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newPostImageSrc = reader.result as string;
      };
      reader.readAsDataURL(this.newPostImage);
    }
  }

  addPost(): void {
    const userId = this.loginAuthService.getUserId();
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    if (this.newPostText.trim()) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('caption', this.newPostText);
      if (this.newPostImage) {
        formData.append('image', this.newPostImage, this.newPostImage.name);
      } else if (this.newPostImageSrc) {
        formData.append('image_src', this.newPostImageSrc);
      }
      if (this.newRecipeId) {
        formData.append('recipeId', this.newRecipeId.toString());
      }
      this.communityService.addPost(formData).subscribe(
        response => {
          console.log('Response from server:', response);
          if (response.success) {
            this.loadPosts();
            this.newPostText = '';
            this.newPostImage = null;
            this.newPostImageSrc = null;
            this.newRecipeId = null;
            this.newRecipe = null; 
          } else {
            console.error('Error adding post:', response.message);
          }
        },
        error => {
          console.error('HTTP error:', error);
          alert('An error occurred while adding the post: ' + error.message);
        }
      );
    }
  }

  addComment(post: Post): void {
    const userId = this.loginAuthService.getUserId();
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    this.userService.getUserProfile().subscribe(
      userProfile => {
        const { username, profile_picture } = userProfile;
        const commentData: Comment = {
          userAvatar: profile_picture,
          username: username,
          text: this.newCommentText.trim(),
          time: 'just now',
          liked: false
        };
        const community_recipe_id = post.communityRecipeId;
        if (!community_recipe_id || !userId || !commentData.text) {
          console.error('Invalid comment data', commentData);
          return;
        }
        const payload = {
          community_recipe_id: community_recipe_id,
          user_id: userId,
          text: commentData.text
        };
        this.communityService.addComment(payload).subscribe(
          response => {
            console.log('Response from server:', response);
            if (response.success) {
              post.comments.push(commentData);
              this.newCommentText = '';
              this.loadPosts();
            } else {
              console.error('Error adding comment:', response.message);
            }
          },
          error => {
            console.error('HTTP error:', error);
            alert('An error occurred while adding the comment: ' 
              + error.message);
          }
        );
      },
      error => {
        console.error('Error fetching user profile:', error);
        alert('An error occurred while fetching user profile: '
           + error.message);
      }
    );
  }
}
