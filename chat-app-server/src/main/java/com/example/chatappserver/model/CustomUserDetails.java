import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final String userImageUrl; // Your custom field
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String username, String password, String userImageUrl, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.userImageUrl = userImageUrl;
        this.authorities = authorities;
    }

    // Implement the UserDetails methods
    // ...

    // Create getters for your custom field
    public String getUserImageUrl() {
        return userImageUrl;
    }
}