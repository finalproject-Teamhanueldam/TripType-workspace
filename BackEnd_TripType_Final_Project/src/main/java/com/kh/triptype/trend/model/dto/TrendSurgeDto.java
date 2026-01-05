// ✅ TrendSurgeDto.java
package com.kh.triptype.trend.model.dto;

public class TrendSurgeDto {
    private String depart;
    private String arrive;
    private Double growthPct;
    private Integer days;

    public String getDepart() { return depart; }
    public void setDepart(String depart) { this.depart = depart; }

    public String getArrive() { return arrive; }
    public void setArrive(String arrive) { this.arrive = arrive; }

    public Double getGrowthPct() { return growthPct; }
    public void setGrowthPct(Double growthPct) { this.growthPct = growthPct; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
}
