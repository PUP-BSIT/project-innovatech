import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SavedRecipesService } from '../../services/saved-recipes.service';
import { LoginAuthentication } from '../../services/login-authentication.service';
import { CommunityService } from '../../services/community-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  showSavedRecipes = true;
  showMealPlanning = false;
  showActivityLog = false;
  showEditModal = false;
  showAvatarModal = false;
  showShareRecipeModal = false;
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  avatarImageUrl: string | ArrayBuffer | null = null;
  selectedAvatarFile: File | null = null;

  recipeForm: FormGroup;
  savedRecipes: any[] = [];
  userPosts: any[] = [];

  userProfile: any = {
    user_id: null,
    email: '',
    username: '',
    bio: '',
    profile_picture: '',
  };
  profileForm: FormGroup;

  currentPage: number = 1;
  pageSize: number = 3;
  totalRecipes: number = 0;
  totalPages: number = 1;

  currentPostPage: number = 1;
  totalPosts: number = 0;
  totalPostPages: number = 1;

  selectedMealTypes: string[] = [];
  mealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];
  showMealTypeDropdown = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private savedRecipesService: SavedRecipesService,
    private communityService: CommunityService
  ) {
    this.recipeForm = this.createRecipeForm();
    this.profileForm = this.fb.group({
      mealTypes: [[], Validators.required],
      username: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.route.queryParams.subscribe((params) => {
      if (params['showSavedRecipes']) {
        this.showSavedRecipes = true;
        this.showMealPlanning = false;
        this.showActivityLog = false;
      }
      if (params['showShareRecipe']) {
        this.showShareRecipeModal = true;
      }
    });
  }

  private createRecipeForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mealTypes: [[], Validators.required],
      dietaryPreferences: ['', Validators.required],
      minutes: [null, Validators.required],
      servings: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: ['', Validators.required], 
      image: [null, Validators.required],
    });
  }

  private createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      
      quantity: ['', [Validators.required, this.fractionValidator]],
      unit: [''],
    });
  }

  fractionValidator(control: FormControl) {
    const value = control.value;
    if (!value) return null;
    const fractionPattern = /^(\d+\/\d+|\d+(\.\d+)?)(\s*\w+)?$/; 
    return fractionPattern.test(value) ? null : { invalidFraction: true };
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.userProfile = data;
        if (!this.userProfile.username) {
          this.userProfile.username = this.userProfile.email;
        }
        this.avatarImageUrl = this.userProfile.profile_picture;
        this.fetchSavedRecipes();
      },
      error: (error: any) => {
        console.error('Error fetching user profile:', error);
      },
    });
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || !inputElement.files[0]) return;

    this.selectedFile = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onAvatarSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || !inputElement.files[0]) return;

    this.selectedAvatarFile = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarImageUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedAvatarFile);
    this.uploadAvatar();
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      const formData = this.createFormData(formValue);
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
  
      const instructionsArray = formValue.instructions.split('\n').map
        ((step: string, index: number) => ({
        step: ` ${step}`
      }));
      formData.append('instructions', JSON.stringify(instructionsArray));
  
      this.recipeService.addRecipe(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.recipeForm.reset();
          this.imageUrl = null;
          this.selectedFile = null;
          this.closeShareRecipeModal();
          this.snackBar.open('Recipe added successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (error: any) => {
          console.error('Error adding recipe:', error);
          console.log('Full error response:', error);
          this.snackBar.open('Error adding recipe. Please try again.', 
            'Close', { duration: 3000,
          });
        },
      });
    }
  }
  
  

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private createFormData(formValue: any): FormData {
    const formData = new FormData();
    Object.keys(formValue).forEach((key) => {
      if (key === 'ingredients' || key === 'instructions' || key === 'mealTypes') {
        if (Array.isArray(formValue[key])) {
          formData.append(key, JSON.stringify(formValue[key]));
        } else {
          console.error(`Expected array for ${key} but got:`, formValue[key]);
        }
      } else {
        formData.append(key, formValue[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    formData.append('user_id', this.userProfile.user_id);

    return formData;
  }

  openShareRecipeModal(): void {
    this.showShareRecipeModal = true;
  }

  closeShareRecipeModal(): void {
    this.showShareRecipeModal = false;
  }

  toggleSavedRecipes(): void {
    this.showSavedRecipes = !this.showSavedRecipes;
    this.showMealPlanning = false;
    this.showActivityLog = false;
  }

  toggleMealPlanning(): void {
    this.showMealPlanning = !this.showMealPlanning;
    this.showSavedRecipes = false;
    this.showActivityLog = false;
    this.fetchUserPosts();
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveChanges(): void {
    this.userService.updateUserProfile(this.userProfile).subscribe({
      next: (response: any) => {
        console.log('Profile updated successfully');
        this.userProfile = response.user;
        this.closeEditModal();
        this.snackBar.open('User Profile Successfully Edited', 'Close', {
          duration: 4000,
        });
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        this.showSnackBar('Error updating profile. Please try again.');
      },
    });
  }

  changeAvatar(): void {
    this.avatarInput.nativeElement.click();
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadAvatar(): void {
    if (!this.selectedAvatarFile) return;

    const formData = new FormData();
    formData.append(
      'avatar',
      this.selectedAvatarFile,
      this.selectedAvatarFile.name
    );
    formData.append('user_id', this.userProfile.user_id);

    this.userService.updateUserAvatar(formData).subscribe({
      next: (response: any) => {
        this.userProfile.profile_picture = response.profile_picture;
        this.avatarImageUrl =
          response.profile_picture || 'assets/images/default-avatar.jpg';
        this.showSnackBar('Avatar updated successfully!');
      },
      error: (error: any) => {
        console.error('Error updating avatar:', error);
        this.showSnackBar('Error updating avatar. Please try again.');
      },
    });
  }

  triggerAvatarInput(): void {
    this.avatarInput.nativeElement.click();
  }

  fetchSavedRecipes(page: number = 1): void {
    const userId = this.userProfile.user_id;
    if (!userId) return;

    this.savedRecipesService
      .getSavedRecipes(userId, page, this.pageSize)
      .subscribe({
        next: (data: any) => {
          console.log('Fetched saved recipes:', data);
          this.savedRecipes = data.recipes.reverse();
          this.currentPage = page;
          this.totalRecipes = data.total;
          this.totalPages = Math.ceil(this.totalRecipes / this.pageSize);
        },
        error: (error: any) => {
          console.error('Error fetching saved recipes:', error);
        },
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchSavedRecipes(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.fetchSavedRecipes(this.currentPage - 1);
    }
  }

  fetchUserPosts(page: number = 1): void {
    const userId = this.userProfile.user_id;
    if (!userId) return;

    this.communityService.getUserPosts(userId, page, this.pageSize).subscribe({
      next: (data: any) => {
        this.userPosts = data.posts.map((post: any) => {
          post.image = 'data:image/jpeg;base64,' + post.image;
          return post;
        });
        this.currentPostPage = page;
        this.totalPosts = data.total;
        this.totalPostPages = Math.ceil(this.totalPosts / this.pageSize);
      },
      error: (error: any) => {
        console.error('Error fetching user posts:', error);
      },
    });
  }

  nextPostPage(): void {
    if (this.currentPostPage < this.totalPostPages) {
      this.fetchUserPosts(this.currentPostPage + 1);
    }
  }

  previousPostPage(): void {
    if (this.currentPostPage > 1) {
      this.fetchUserPosts(this.currentPostPage - 1);
    }
  }

  toggleDropdown(): void {
    this.showMealTypeDropdown = !this.showMealTypeDropdown;
  }

  selectMealType(mealType: string): void {
    if (!this.selectedMealTypes.includes(mealType)) {
      this.selectedMealTypes.push(mealType);
      this.recipeForm.patchValue({ mealTypes: this.selectedMealTypes });
    }
    this.showMealTypeDropdown = false;
  }

  removeMealType(mealType: string): void {
    this.selectedMealTypes = this.selectedMealTypes.filter(mt => mt !== mealType);
    this.recipeForm.patchValue({ mealTypes: this.selectedMealTypes });
  }

  isSelected(mealType: string): boolean {
    return this.selectedMealTypes.includes(mealType);
  }
}
