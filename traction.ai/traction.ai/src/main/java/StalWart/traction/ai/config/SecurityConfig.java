package StalWart.traction.ai.config;

import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import StalWart.traction.ai.repository.UserRepository;
import StalWart.traction.ai.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final UserRepository userRepository;
	private final JwtAuthenticationFilter jwtAuthFilter;

	/**
	 * {@code @Lazy} breaks the cycle: SecurityConfig → JwtAuthenticationFilter → UserDetailsService
	 * (bean method on this class) → SecurityConfig.
	 */
	public SecurityConfig(UserRepository userRepository, @Lazy JwtAuthenticationFilter jwtAuthFilter) {
		this.userRepository = userRepository;
		this.jwtAuthFilter = jwtAuthFilter;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration c = new CorsConfiguration();
		// Local dev + production frontend (https://traction-ai-gold.vercel.app/) + other Vercel preview URLs
		c.setAllowedOriginPatterns(List.of(
				"http://localhost:*",
				"http://127.0.0.1:*",
				"https://traction-ai-gold.vercel.app",
				"https://*.vercel.app"));
		c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		c.setAllowedHeaders(List.of("*"));
		c.setExposedHeaders(List.of("Authorization"));
		c.setAllowCredentials(true);
		c.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
		s.registerCorsConfiguration("/**", c);
		return s;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults())
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/v1/**").permitAll()
						.requestMatchers("/error").permitAll()
						.anyRequest().authenticated())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return username -> userRepository.findByEmail(username)
				.map(user -> new org.springframework.security.core.userdetails.User(
						user.getEmail(),
						user.getPassword(),
						Collections.emptyList()))
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
