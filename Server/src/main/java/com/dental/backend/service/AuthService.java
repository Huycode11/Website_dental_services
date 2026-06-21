package com.dental.backend.service;

import com.dental.backend.dto.request.LoginRequest;
import com.dental.backend.dto.request.RegisterRequest;
import com.dental.backend.dto.request.ChangePasswordRequest;
import com.dental.backend.dto.response.AuthResponse;
import com.dental.backend.entity.User;
import com.dental.backend.enums.Role;
import com.dental.backend.repository.UserRepository;
import com.dental.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        String pwd = request.getPassword();
        if (pwd.length() < 8) {
            throw new RuntimeException("Mật khẩu phải dài ít nhất 8 ký tự.");
        }
        if (!pwd.matches(".*[A-Z].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ hoa.");
        }
        if (!pwd.matches(".*[0-9].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ số.");
        }
        if (!pwd.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
        }
        if (!pwd.matches("^[\\x21-\\x7E]+$")) {
            throw new RuntimeException("Mật khẩu không được chứa khoảng trắng hoặc ký tự có dấu.");
        }

        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.PATIENT.name())
                .active(true)
                .createdAt(Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public void forgotPassword(com.dental.backend.dto.request.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống."));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        
        // Save to user with 10 mins expiry
        user.setResetCode(otp);
        user.setResetCodeExpiry(Instant.now().plusSeconds(600).toString());
        userRepository.save(user);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), otp);
    }

    public void resetPassword(com.dental.backend.dto.request.ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống."));

        // Check OTP
        if (user.getResetCode() == null || !user.getResetCode().equals(request.getOtp())) {
            throw new RuntimeException("Mã OTP không chính xác.");
        }

        // Check expiry
        if (user.getResetCodeExpiry() == null || Instant.parse(user.getResetCodeExpiry()).isBefore(Instant.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        // Validate password complexity
        String pwd = request.getNewPassword();
        if (pwd.length() < 8) {
            throw new RuntimeException("Mật khẩu phải dài ít nhất 8 ký tự.");
        }
        if (!pwd.matches(".*[A-Z].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ hoa.");
        }
        if (!pwd.matches(".*[0-9].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ số.");
        }
        if (!pwd.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
        }
        if (!pwd.matches("^[\\x21-\\x7E]+$")) {
            throw new RuntimeException("Mật khẩu không được chứa khoảng trắng hoặc ký tự có dấu.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(pwd));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        user.setUpdatedAt(Instant.now().toString());
        userRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không chính xác.");
        }

        String pwd = request.getNewPassword();
        if (pwd.length() < 8) {
            throw new RuntimeException("Mật khẩu phải dài ít nhất 8 ký tự.");
        }
        if (!pwd.matches(".*[A-Z].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ hoa.");
        }
        if (!pwd.matches(".*[0-9].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một chữ số.");
        }
        if (!pwd.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new RuntimeException("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
        }
        if (!pwd.matches("^[\\x21-\\x7E]+$")) {
            throw new RuntimeException("Mật khẩu không được chứa khoảng trắng hoặc ký tự có dấu.");
        }

        user.setPassword(passwordEncoder.encode(pwd));
        user.setUpdatedAt(Instant.now().toString());
        userRepository.save(user);
    }
}
