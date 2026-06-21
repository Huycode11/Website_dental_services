package com.dental.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendPasswordResetEmail(String toEmail, String otpCode) {
        String subject = "Mã xác nhận lấy lại mật khẩu - Dentivo";
        String htmlBody = "<html><body>"
                + "<h2>Yêu cầu đặt lại mật khẩu</h2>"
                + "<p>Xin chào,</p>"
                + "<p>Bạn vừa yêu cầu lấy lại mật khẩu tại nha khoa Dentivo. Dưới đây là mã OTP của bạn:</p>"
                + "<h1 style='color: #316E65;'>" + otpCode + "</h1>"
                + "<p>Mã này sẽ hết hạn sau 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>"
                + "<br/>"
                + "<p>Trân trọng,</p>"
                + "<p>Đội ngũ Dentivo</p>"
                + "</body></html>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates html

            mailSender.send(message);
            log.info("Password reset email sent via Gmail to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Lỗi khi gửi email xác nhận. Vui lòng thử lại sau.", e);
        }
    }
}
