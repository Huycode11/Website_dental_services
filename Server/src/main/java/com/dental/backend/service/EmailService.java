package com.dental.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.Body;
import software.amazon.awssdk.services.sesv2.model.Content;
import software.amazon.awssdk.services.sesv2.model.Destination;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.Message;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SesV2Client sesV2Client;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${AWS_SES_SENDER_EMAIL:phamvanhuyhuy2020@gmail.com}")
    private String awsSesSenderEmail;

    public void sendPasswordResetEmail(String toEmail, String otpCode) {
        String subject = "Mã xác nhận lấy lại mật khẩu - Dentivo";
        String htmlBody = "<div style=\"font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">"
                + "<div style=\"background-color: #0d9488; padding: 24px; text-align: center;\">"
                + "<h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;\">DENTIVO</h1>"
                + "</div>"
                + "<div style=\"padding: 32px; color: #374151; line-height: 1.6;\">"
                + "<h2 style=\"color: #111827; margin-top: 0; font-size: 20px;\">Yêu cầu đặt lại mật khẩu</h2>"
                + "<p style=\"font-size: 16px;\">Xin chào,</p>"
                + "<p style=\"font-size: 16px;\">Bạn vừa yêu cầu lấy lại mật khẩu tại nha khoa Dentivo. Dưới đây là mã OTP của bạn:</p>"
                + "<div style=\"background-color: #f0fdfa; border: 1px dashed #14b8a6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;\">"
                + "<h1 style=\"color: #0f766e; font-size: 36px; letter-spacing: 4px; margin: 0;\">" + otpCode + "</h1>"
                + "</div>"
                + "<p style=\"font-size: 14px; color: #6b7280;\">Mã này sẽ hết hạn sau 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>"
                + "<p style=\"font-size: 16px; margin-top: 32px;\">Trân trọng,<br><strong style=\"color: #0d9488;\">Đội ngũ Dentivo</strong></p>"
                + "</div>"
                + "<div style=\"background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;\">"
                + "<p style=\"margin: 0;\">Nha khoa Dentivo - Nụ cười của bạn là niềm vui của chúng tôi</p>"
                + "</div>"
                + "</div>"
                + "</div>";

        try {
            SendEmailRequest request = SendEmailRequest.builder()
                    .fromEmailAddress(awsSesSenderEmail)
                    .destination(Destination.builder().toAddresses(toEmail).build())
                    .content(EmailContent.builder()
                            .simple(Message.builder()
                                    .subject(Content.builder().data(subject).charset("UTF-8").build())
                                    .body(Body.builder()
                                            .html(Content.builder().data(htmlBody).charset("UTF-8").build())
                                            .build())
                                    .build())
                            .build())
                    .build();

            sesV2Client.sendEmail(request);
            log.info("Password reset email sent via AWS SES to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Lỗi khi gửi email xác nhận. Vui lòng thử lại sau.", e);
        }
    }

    public void sendBookingConfirmationEmail(String toEmail, String appointmentDate, String timeSlot) {
        String subject = "Xác nhận đặt lịch khám - Dentivo";
        String htmlBody = "<div style=\"font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">"
                + "<div style=\"background-color: #0d9488; padding: 24px; text-align: center;\">"
                + "<h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;\">DENTIVO</h1>"
                + "</div>"
                + "<div style=\"padding: 32px; color: #374151; line-height: 1.6;\">"
                + "<h2 style=\"color: #111827; margin-top: 0; font-size: 20px;\">Xác nhận đặt lịch khám</h2>"
                + "<p style=\"font-size: 16px;\">Xin chào,</p>"
                + "<p style=\"font-size: 16px;\">Cảm ơn bạn đã tin tưởng và đặt lịch khám tại nha khoa <strong>Dentivo</strong>. Dưới đây là thông tin lịch khám của bạn:</p>"
                + "<div style=\"background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;\">"
                + "<p style=\"margin: 0 0 8px 0; font-size: 16px;\"><strong style=\"color: #475569;\">📅 Ngày khám:</strong> <span style=\"color: #0f766e; font-weight: 600;\">" + appointmentDate + "</span></p>"
                + "<p style=\"margin: 0; font-size: 16px;\"><strong style=\"color: #475569;\">⏰ Giờ khám:</strong> <span style=\"color: #0f766e; font-weight: 600;\">" + timeSlot + "</span></p>"
                + "</div>"
                + "<p style=\"font-size: 16px;\">Vui lòng đến phòng khám đúng giờ để được phục vụ tốt nhất.</p>"
                + "<p style=\"font-size: 16px; margin-top: 32px;\">Trân trọng,<br><strong style=\"color: #0d9488;\">Đội ngũ Dentivo</strong></p>"
                + "</div>"
                + "<div style=\"background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;\">"
                + "<p style=\"margin: 0;\">Nha khoa Dentivo - Nụ cười của bạn là niềm vui của chúng tôi</p>"
                + "</div>"
                + "</div>"
                + "</div>";

        try {
            SendEmailRequest request = SendEmailRequest.builder()
                    .fromEmailAddress(awsSesSenderEmail)
                    .destination(Destination.builder().toAddresses(toEmail).build())
                    .content(EmailContent.builder()
                            .simple(Message.builder()
                                    .subject(Content.builder().data(subject).charset("UTF-8").build())
                                    .body(Body.builder()
                                            .html(Content.builder().data(htmlBody).charset("UTF-8").build())
                                            .build())
                                    .build())
                            .build())
                    .build();

            sesV2Client.sendEmail(request);
            log.info("Booking confirmation email sent via AWS SES to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to {}: {}", toEmail, e.getMessage());
            // We don't throw exception here to prevent blocking the appointment creation process
        }
    }

    public void sendDoctorNotificationEmail(String doctorEmail, String patientName, String appointmentDate, String timeSlot) {
        String subject = "Thông báo nhận lịch khám mới - Dentivo";
        String htmlBody = "<div style=\"font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 0; margin: 0;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">"
                + "<div style=\"background-color: #0d9488; padding: 24px; text-align: center;\">"
                + "<h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;\">DENTIVO</h1>"
                + "</div>"
                + "<div style=\"padding: 32px; color: #374151; line-height: 1.6;\">"
                + "<h2 style=\"color: #111827; margin-top: 0; font-size: 20px;\">Thông báo nhận lịch khám mới</h2>"
                + "<p style=\"font-size: 16px;\">Xin chào Bác sĩ,</p>"
                + "<p style=\"font-size: 16px;\">Bạn vừa được phân công một lịch khám mới từ bệnh nhân <strong style=\"color: #0f766e;\">" + patientName + "</strong>.</p>"
                + "<div style=\"background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 16px 20px; margin: 24px 0; border-radius: 8px;\">"
                + "<p style=\"margin: 0 0 8px 0; font-size: 16px;\"><strong style=\"color: #475569;\">📅 Ngày khám:</strong> <span style=\"font-weight: 600;\">" + appointmentDate + "</span></p>"
                + "<p style=\"margin: 0; font-size: 16px;\"><strong style=\"color: #475569;\">⏰ Giờ khám:</strong> <span style=\"font-weight: 600;\">" + timeSlot + "</span></p>"
                + "</div>"
                + "<p style=\"font-size: 16px;\">Vui lòng đăng nhập vào hệ thống để xem chi tiết hồ sơ bệnh nhân và chuẩn bị.</p>"
                + "<p style=\"font-size: 16px; margin-top: 32px;\">Trân trọng,<br><strong style=\"color: #0d9488;\">Hệ thống quản lý Dentivo</strong></p>"
                + "</div>"
                + "<div style=\"background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb;\">"
                + "<p style=\"margin: 0;\">Nha khoa Dentivo - Email này được tạo tự động từ hệ thống.</p>"
                + "</div>"
                + "</div>"
                + "</div>";

        try {
            SendEmailRequest request = SendEmailRequest.builder()
                    .fromEmailAddress(awsSesSenderEmail)
                    .destination(Destination.builder().toAddresses(doctorEmail).build())
                    .content(EmailContent.builder()
                            .simple(Message.builder()
                                    .subject(Content.builder().data(subject).charset("UTF-8").build())
                                    .body(Body.builder()
                                            .html(Content.builder().data(htmlBody).charset("UTF-8").build())
                                            .build())
                                    .build())
                            .build())
                    .build();

            sesV2Client.sendEmail(request);
            log.info("Doctor notification email sent via AWS SES to {}", doctorEmail);
        } catch (Exception e) {
            log.error("Failed to send doctor notification email to {}: {}", doctorEmail, e.getMessage());
        }
    }
}
