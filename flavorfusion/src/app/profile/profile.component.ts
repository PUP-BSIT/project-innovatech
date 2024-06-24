import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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

  userProfile: any = {
    user_id: null,
    email: '',
    username: '',
    bio: '',
    profile_picture: ''
  };
  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.recipeForm = this.createRecipeForm();
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      bio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.route.queryParams.subscribe(params => {
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
      mealType: ['', Validators.required],
      dietaryPreferences: ['', Validators.required],
      hours: [null, Validators.required],
      minutes: [null, Validators.required],
      servings: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([this.createInstruction()]),
      image: [null, Validators.required]
    });
  }

  private createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]]
    });
  }

  private createInstruction(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required]
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
        console.log(this.userProfile);
      },
      error: (error: any) => {
        console.error("Error fetching user profile:", error);
      }
    });
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      this.selectedFile = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onAvatarSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      this.selectedAvatarFile = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarImageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedAvatarFile);
      this.uploadAvatar();
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      console.log("Form is valid, submitting...");
      const formData = this.createFormData(this.recipeForm.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.recipeService.addRecipe(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            this.recipeForm.reset();
            this.imageUrl = null;
            this.selectedFile = null;
            this.closeShareRecipeModal();
            this.snackBar.open('Recipe added successfully!', 'Close', {
              duration: 3000,
            });
          } else {
            console.error('Error adding recipe:', response);
            this.snackBar.open('Error adding recipe. Please try again.',
              'Close', {
                duration: 3000,
              });
          }
        },
        error: (error: any) => {
          console.error('Error adding recipe:', error);
          this.snackBar.open('Error adding recipe. Please try again.',
            'Close', {
              duration: 3000,
            });
        }
      });
    }
  }

  private createFormData(formValue: any): FormData {
    const formData = new FormData();
    Object.keys(formValue).forEach(key => {
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
        this.snackBar.open('Error updating profile. Please try again.', 'Close', {
          duration: 3000,
        });
      }
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
    if (this.selectedAvatarFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedAvatarFile,
        this.selectedAvatarFile.name);
      formData.append('user_id', this.userProfile.user_id);

      this.userService.updateUserAvatar(formData).subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Avatar update response:', response);
            this.userProfile.profile_picture = response.profile_picture;
            this.avatarImageUrl = response.profile_picture ||
              'assets/images/default-avatar.jpg';
            this.snackBar.open('Avatar updated successfully!', 'Close', {
              duration: 3000,
            });
          } else {
            console.error('Error updating avatar response:', response);
            this.snackBar.open('Error updating avatar. Please try again.',
              'Close', {
                duration: 3000,
              });
          }
        },
        error: (error: any) => {
          console.error('Error updating avatar:', error);
          this.snackBar.open('Error updating avatar. Please try again.',
            'Close', {
              duration: 3000,
            });
        }
      });
    }
  }

  triggerAvatarInput(): void {
    this.avatarInput.nativeElement.click();
  }
}