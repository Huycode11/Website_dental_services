package com.dental.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpecialtyResponse {
    private String id;
    private String name;
    private String description;
}
