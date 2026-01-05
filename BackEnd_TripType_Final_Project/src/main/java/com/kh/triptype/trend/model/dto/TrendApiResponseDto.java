// ✅ TrendApiResponseDto.java
package com.kh.triptype.trend.model.dto;

import java.util.List;

public class TrendApiResponseDto<T> {
    private boolean success;
    private List<T> data;
    private String message;

    public TrendApiResponseDto() {}

    public TrendApiResponseDto(boolean success, List<T> data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }

    public static <T> TrendApiResponseDto<T> ok(List<T> data) {
        return new TrendApiResponseDto<>(true, data, null);
    }

    public static <T> TrendApiResponseDto<T> fail(String message) {
        return new TrendApiResponseDto<>(false, null, message);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
