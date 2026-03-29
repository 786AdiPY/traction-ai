package StalWart.traction.ai.config;

import StalWart.traction.ai.entity.Profile;
import StalWart.traction.ai.entity.Profile.Category;
import StalWart.traction.ai.entity.Profile.Stage;
import StalWart.traction.ai.entity.User;
import StalWart.traction.ai.repository.ProfileRepository;
import StalWart.traction.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@zenohosp.com";
        
        if (!userRepository.existsByEmail(adminEmail)) {
            // 1. Create Admin User
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setFullName("Admin Zenohosp");
            // Hash the password "admin@123"
            admin.setPassword(passwordEncoder.encode("admin@123"));
            
            userRepository.save(admin);
            
            // 2. Create Company Profile (Zenohosp)
            Profile profile = new Profile();
            profile.setUser(admin);
            profile.setStartupName("Zenohosp");
            profile.setDescription("Zenohosp is a health tech company dedicated to providing better medical solutions.");
            profile.setStage(Stage.launched);
            profile.setCategory(Category.healthtech);
            profile.setTeamSize(10);
            profile.setIsActive(true);
            
            profileRepository.save(profile);
            
            System.out.println("Seeding complete: Admin user and Zenohosp profile created.");
        } else {
            System.out.println("Seeding skipped: Admin user already exists.");
        }
    }
}
