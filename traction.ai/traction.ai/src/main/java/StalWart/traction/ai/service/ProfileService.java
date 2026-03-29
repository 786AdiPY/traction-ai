package StalWart.traction.ai.service;

import StalWart.traction.ai.entity.Profile;
import StalWart.traction.ai.entity.User;
import StalWart.traction.ai.repository.ProfileRepository;
import StalWart.traction.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public Optional<Profile> getActiveProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return profileRepository.findByUser_IdAndIsActiveTrue(user.getId());
    }

    @Transactional
    public Profile createProfile(String email, Profile profile) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Deactivate existing profiles (as per UC-002: "previous profile deactivated if updating")
        profileRepository.findByUser_IdAndIsActiveTrue(user.getId())
                .ifPresent(p -> {
                    p.setIsActive(false);
                    profileRepository.save(p);
                });

        profile.setUser(user);
        profile.setIsActive(true);
        return profileRepository.save(profile);
    }
}
