import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunityService } from '../../services/community-service.service';
import { LoginAuthentication } from '../../services/login-authentication.service';
import { UserService } from '../../services/user-service.service';
import { ShareCommunityService } from '../../services/share-community.service';
import { Post } from '../../model/posts';
import { Comment } from '../../model/comments';
import { Router } from '@angular/router';
import { Recipe } from '../../model/recipe';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  @ViewChild('postDetailTemplate', { static: true }) 
      postDetailTemplate: TemplateRef<any>;
  @ViewChild('sentinel', { static: true }) sentinel: ElementRef;
  dialogRef: MatDialogRef<any> | null = null;
  newPostText: string = '';
  newPostImage: File | null = null;
  newPostImageSrc: string | null = null;
  newCommentText: string = '';
  posts: Post[] = [];
  currentPost: Post | null = null;
  newRecipeId: number | null = null;
  newRecipe: Recipe | null = null;
  page: number = 1; 
  pageSize: number = 8; // Number of posts per page
  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private communityService: CommunityService,
    private loginAuthService: LoginAuthentication,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private shareCommunity: ShareCommunityService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();

    // IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadMorePosts();
      }
    }, { threshold: 1.0 });

    observer.observe(this.sentinel.nativeElement);

    this.shareCommunity.sharedRecipe$.subscribe(recipe => {
      if (recipe) {
        this.newRecipe = recipe;
        this.populatePostWithRecipe(recipe);
      }
    });
  }

  populatePostWithRecipe(recipe: Recipe): void {
    console.log('Received recipe:', recipe);
    this.newPostText = recipe.name;
    this.newRecipeId = recipe.id;
    if (recipe.picture) {
      this.newPostImageSrc = !recipe.picture.startsWith('data:image/')
        ? `data:image/jpeg;base64,${recipe.picture}`
        : recipe.picture;
    } else {
      this.newPostImageSrc = null;
    }
  }

  loadPosts(): void {
    const userId = this.loginAuthService.isLoggedIn() ? this.loginAuthService
        .getUserId() : null;
    this.loading = true;

    this.communityService.getPaginatedPosts(userId, this.page, this.pageSize)
        .subscribe(
      (response: any) => {
        if (response.success) {
          this.posts = response.posts.map(post => {
            post.recipeId = post.recipeId || post.newRecipeId || post.recipe_id;
            return post;
          });
        } else {
          console.error('Error fetching posts:', response.message);
        }
        this.loading = false; 
      },
      error => {
        console.error('HTTP error:', error);
        this.loading = false;
      }
    );
  }

  loadMorePosts(): void {
    this.page++;
    const userId = this.loginAuthService.isLoggedIn() ? this.loginAuthService
        .getUserId() : null;
    this.loading = true; 

    this.communityService.getPaginatedPosts(userId, this.page, this.pageSize)
        .subscribe(
      (response: any) => {
        if (response.success) {
          const newPosts = response.posts.map(post => {
            post.recipeId = post.recipeId || post.newRecipeId || post.recipe_id;
            return post;
          });
          this.posts = [...this.posts, ...newPosts];
        } else {
          console.error('Error fetching more posts:', response.message);
        }
        this.loading = false; 
      },
      error => {
        console.error('HTTP error:', error);
        this.loading = false; 
      }
    );
  }

  openPostDetail(post: Post, template: TemplateRef<any>): void {
    if (!this.dialogRef) { 
      post.recipeId = post.recipeId || this.newRecipeId;
      console.log('Opening post detail:', post);
      this.currentPost = post;
      this.dialogRef = this.dialog.open(template, {
        data: { post },
        width: '600px',
        panelClass: 'custom-dialog-container'
      });
      
      this.dialogRef.afterClosed().subscribe(() => {
        console.log('Modal closed');
        this.currentPost = null;
        this.dialogRef = null; 
      });
    }
  }
  

  navigateToRecipe(post: Post, event: Event): void {
    event.stopPropagation();
    if (post.recipeId) {
      this.router.navigate(['/recipe-details', post.recipeId]);
    }
  }

  closeDialog(): void {
    if (this.dialogRef) {
      console.log('Closing dialog');
      this.dialogRef.close();
    } else {
      console.log('DialogRef is null');
    }
  }

  likePost(post: Post, event: Event): void {
    event.stopPropagation();
    const userId = this.loginAuthService.getUserId();
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    const payload = {
      user_id: userId,
      community_recipe_id: post.communityRecipeId,
      action: post.liked ? 'unlike' : 'like'
    };
    this.communityService.likePost(payload).subscribe(
      response => {
        if (response.success) {
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
        } else {
          console.error('Error liking post:', response.message);
        }
      },
      error => {
        console.error('HTTP error:', error);
      }
    );
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
      const snackBarRef = this.snackBar.open('Log in to add a post', 
        'Click to Login', {
        duration: 3000,
      });
  
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/login']); 
      });
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
          if (response.success) {
// TODO: find a more optimized approach than reload for getting newly added post
            location.reload();
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
      const snackBarRef = this.snackBar.open('Log in to add a comment', 
        ' Click to Login', {
        duration: 3000,
      });
  
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/login']);  
      });
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
            if (response.success) {
              post.comments.push(commentData);
              this.newCommentText = '';
             
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
