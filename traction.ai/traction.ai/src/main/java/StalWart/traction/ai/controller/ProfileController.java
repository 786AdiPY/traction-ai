package StalWart.traction.ai.controller;

import StalWart.traction.ai.entity.Profile;
import StalWart.traction.ai.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/active")
    public ResponseEntity<Profile> getActiveProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getActiveProfile(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Profile profile
    ) {
        return ResponseEntity.ok(profileService.createProfile(userDetails.getUsername(), profile));
    }
}
