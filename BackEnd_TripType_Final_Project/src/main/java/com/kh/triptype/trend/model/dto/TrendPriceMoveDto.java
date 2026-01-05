// ✅ TrendPriceMoveDto.java
package com.kh.triptype.trend.model.dto;

public class TrendPriceMoveDto {
    private String depart;
    private String arrive;
    private Double changePct;
    private Integer days;

    public String getDepart() { return depart; }
    public void setDepart(String depart) { this.depart = depart; }

    public String getArrive() { return arrive; }
    public void setArrive(String arrive) { this.arrive = arrive; }

    public Double getChangePct() { return changePct; }
    public void setChangePct(Double changePct) { this.changePct = changePct; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
}
