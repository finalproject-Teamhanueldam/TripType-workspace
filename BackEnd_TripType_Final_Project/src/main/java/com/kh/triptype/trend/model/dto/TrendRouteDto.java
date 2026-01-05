// ✅ TrendRouteDto.java
package com.kh.triptype.trend.model.dto;

public class TrendRouteDto {
    private String depart;
    private String arrive;
    private int count;

    public TrendRouteDto() {}

    public String getDepart() { return depart; }
    public void setDepart(String depart) { this.depart = depart; }

    public String getArrive() { return arrive; }
    public void setArrive(String arrive) { this.arrive = arrive; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
