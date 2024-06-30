import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service.service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SavedRecipesService } from '../../services/saved-recipes.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  showSavedRecipes: boolean = true;
  showMealPlanning: boolean = false;
  showActivityLog: boolean = false;
  showEditModal: boolean = false;
  showAvatarModal: boolean = false;
  showShareRecipeModal: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  avatarImageUrl: string | ArrayBuffer | null = null;
  selectedAvatarFile: File | null = null;

  recipeForm: FormGroup;
  savedRecipes: any[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private savedRecipesService: SavedRecipesService
  ) {
    this.recipeForm = this.createRecipeForm();
    this.profileForm = this.fb.group({
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
    // this.fetchSavedRecipes();
  }

  private createRecipeForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mealType: ['', Validators.required],
      dietaryPreferences: ['', Validators.required],
      hours: [null, Validators.required],
      minutes: [null, Validators.required],
      servings: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([this.createInstruction()]),
      image: [null, Validators.required],
    });
  }

  private createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private createInstruction(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required],
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addInstruction(): void {
    this.instructions.push(this.createInstruction());
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
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
    if (this.recipeForm.valid) return;

    const formData = this.createFormData(this.recipeForm.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.recipeService.addRecipe(formData).subscribe({
      next: (response: any) => {
        // Remove any and define a type
        if (response.success) {
          // TODO(any group member): Remove below comments.
          // Instead of having success property, you can just return error code
          // from the server(such as 301, 400, etc) in case of error.
          // That way, it will be automatically handled in the error and you
          // can omit the response.success property checking.
          this.recipeForm.reset();
          this.imageUrl = null;
          this.selectedFile = null;
          this.closeShareRecipeModal();
          this.showSnackBar('Recipe added successfully!');
          return;
        }
        this.showSnackBar(`Error adding recipe: ${response}`);
      },
      error: (error: any) => {// User HttpResponseError
        this.showSnackBar(`Error adding recipe: ${error}`);
      },
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {duration: 3000});
  }

  private createFormData(formValue: any): FormData {
    const formData = new FormData();
    Object.keys(formValue).forEach((key) => {
      if (key === 'ingredients' || key === 'instructions') {
        formData.append(key, JSON.stringify(formValue[key]));
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
  }

  toggleActivityLog(): void {
    this.showActivityLog = !this.showActivityLog;
    this.showSavedRecipes = false;
    this.showMealPlanning = false;
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
        if (response.success) {
          console.log('Profile updated successfully');
          this.userProfile = response.user;
          this.closeEditModal();
          this.snackBar.open('User Profile Successfully Edited', 'Close', {
            duration: 4000,
          });
        } else {
          console.error('Error updating profile:', response.message);
        }
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
        if (response.success) {
          this.userProfile.profile_picture = response.profile_picture;
          this.avatarImageUrl =
            response.profile_picture || 'assets/images/default-avatar.jpg';
          this.showSnackBar('Avatar updated successfully!');
        } else {
          console.error('Error updating avatar response:', response);
          this.showSnackBar('Error updating avatar. Please try again.');
        }
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

  //for saved recipes
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
}
