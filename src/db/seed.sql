USE sparkreach;

-- Replace password hash with a real bcrypt hash if needed for login testing
INSERT INTO users (name,email,password_hash,phone,ev_model,is_host) VALUES ('Demo Host','host@example.com','$2b$10$KIXQplaceholderhash', '9999999999','Nexon EV',1);
INSERT INTO hosts (user_id,name,phone,lat,lon,address_brief) VALUES (1,'Demo Host Location','9999999999',18.5204,73.8567,'Pune - MG Road');
INSERT INTO chargers (host_id,connector_type,power_kw,is_ac,is_dc,per_kwh_price,lat,lon) VALUES (1,'CCS',22,0,1,25,18.5204,73.8567);
