import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../model/posts';
import { Comment } from '../../model/comments';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent {
  @ViewChild('postDetailTemplate') postDetailTemplate: TemplateRef<any>;
  dialogRef: MatDialogRef<any>;
  newCommentText: string = ''

  posts: Post[] = [
    {
      username: 'janedoe',
      time: '1h',
      userAvatar: 'assets/images/jane.png',
      image: 'assets/images/salad.jpg',
      description: 'Chicken Salad',
      likes: 0,
      liked: false,
      comments: [
        {
          username: 'apol',
          time: '45 minutes ago',
          userAvatar: 'assets/images/apol.png',
          text: `I can\'t express enough how much I adore your recipe. 
          It\'s like a little slice of culinary heaven on a plate!`,
          liked: false
        },
        {
          username: 'orange',
          time: '1 hour ago',
          userAvatar: 'assets/images/orange.png',
          text: `I\'m endlessly thankful for your recipe--it\'s 
          like a delicious gift that keeps on giving every time I make it`,
          liked: false
        }
      ],
      caption: ''
    },
    {
      username: 'sara_lee',
      time: '3d',
      userAvatar: 'assets/images/sarah.jpg',
      image: 'assets/images/spag.jpg',
      description: 'Saucy Spaghetti',
      likes: 13,
      liked: false,
      comments: [],
      caption: 'Moist and flavorful'
    },
    {
      username: 'sara_lee',
      time: '3d',
      userAvatar: 'assets/images/sarah.jpg',
      image: 'assets/images/vanilla_cake.jpg',
      description: 'Vanilla Cake',
      likes: 13,
      liked: false,
      comments: [],
      caption: ''
    }
  ];
//TO DO: Malaluan, Kyla ->
//Replace this after implementing user post functionality.

  constructor(public dialog: MatDialog) {}

  openPostDetail(post: Post, template: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(template, {
      data: { post },
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
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

  addComment(post: Post): void {
    if (this.newCommentText.trim()) {
      post.comments.push({
        username: 'current_user', 
        time: 'Just now',
        userAvatar: 'assets/images/default-avatar.png',
        text: this.newCommentText,
        liked: false 
      });
      this.newCommentText = '';
    }
  }
}
//TO DO: Malaluan, Kyla ->
//Replace this after implementing the function for adding comments by the user.
