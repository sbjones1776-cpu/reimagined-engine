package app.web.math_adventure_app.twa;


public class DelegationService extends
        com.google.androidbrowserhelper.trusted.DelegationService {
    @Override
    public void onCreate() {
        super.onCreate();
        // Billing library removed - using web-based payments only
    }
}

