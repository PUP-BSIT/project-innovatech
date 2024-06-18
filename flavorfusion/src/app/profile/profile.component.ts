import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  showSavedRecipes: boolean = false;
  showMealPlanning: boolean = false;
  showActivityLog: boolean = false;
  showEditModal: boolean = false;
  showAvatarModal: boolean = false;
  showShareRecipeModal: boolean = false;
  selectedFile: File | null = null;

  recipeForm: FormGroup;
  // imageUrl: string | ArrayBuffer | null = null;
  // imageUrl: string | ArrayBuffer = '';
  userProfile: any = {
    user_id: null,
    email: '',
    username: '',
    bio: '',
  };
  // showEditModal: boolean = false;



  profileForm: FormGroup;

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private recipeService: RecipeService,
    private userService: UserService
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
      // image: [null, Validators.required]
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

  // getUserProfile(): void {
  //   this.userService.getUserProfile().subscribe({
  //     next: (data: any) => {
  //       this.userProfile = data;
  //       console.log(this.userProfile);
  //     },
  //     error: (error: any) => {
  //       console.error("Error fetching user profile:", error);  
  //     }
  //   });
  // }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
        next: (data: any) => {
            // Set email as username if username is not set
            this.userProfile = data;
            if (!this.userProfile.username) {
                this.userProfile.username = this.userProfile.email;
            }
            console.log(this.userProfile);
        },
        error: (error: any) => {
            console.error("Error fetching user profile:", error);  
        }
    });
}


  // handleRouteParams(): void {
  //   this.route.queryParams.subscribe(params => {
  //     if (params['showSavedRecipes']) {
  //       this.showSavedRecipes = true;
  //       this.showMealPlanning = false;
  //       this.showActivityLog = false;
  //     }
  //   });
  // }

//   onImageSelected(event: Event): void {
//     const inputElement = event.target as HTMLInputElement;
//     if (inputElement.files && inputElement.files[0]) {
//       const file = inputElement.files[0];
//       this.recipeForm.patchValue({ image: file });
//       // this.recipeForm.get('image').updateValueAndValidity();

//       // Preview image
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imageUrl = reader.result as string;
//       };
//       reader.readAsDataURL(file);
//     }
// }

//tsaka na baguhin after push the edit
onSubmit(): void {
  if (this.recipeForm.valid) {
    console.log("Form is valid, submitting...");
    const formData = this.createFormData(this.recipeForm.value);

    this.recipeService.addRecipe(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success) {
          this.recipeForm.reset();
          this.closeShareRecipeModal();
        } else {
          console.error('Error adding recipe:', response);
          alert('Error adding recipe. Please try again later.');
        }
      },
      error: (error: any) => {
        console.error('Error adding recipe:', error);
        alert('Error adding recipe. Please try again later.');
      }
    });
  }
}

private createFormData(formValue: any): FormData {
  const formData = new FormData();
  Object.keys(formValue).forEach(key => {
    if (key === 'ingredients' || key === 'instructions') {
      formData.append(key, JSON.stringify(formValue[key]));
    } else if (key === 'image' && formValue[key]) {
      formData.append('image', formValue[key], formValue[key].name);
    } else {
      formData.append(key, formValue[key]);
    }
  });
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
  // editProfileModalOpen = false;

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
          // Dapat ma-refresh ang user profile data mula sa backend
          this.userProfile = response.user; // Assign updated profile data
          this.closeEditModal(); // Isara ang modal pagkatapos ng pag-update
        } else {
          console.error('Error updating profile:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
      }
    });
  }

  //for edit user 
//   this.userService.updateUserProfile(profileData).subscribe({
//     next: (response: any) => {
//     if(response.success) {
//       console.log('Profile is edited successfully'); //for testing
//       this.getUserProfile();
//       this.closeEditModal();
//     } else {
//       console.error('Error updating profile', response.message);
//     }
//   },
//     error: (error: any) => {
//       console.error('Error updating profile', error);
//     }
//   });
// }

  changeAvatar(): void {
    this.showAvatarModal = true;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadAvatar() {
    if (this.selectedFile) {
      console.log('Uploading file:', this.selectedFile);
      this.closeAvatarModal();
    }
  }
}