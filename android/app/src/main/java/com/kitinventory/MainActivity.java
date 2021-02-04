package com.kitinventory;

import com.facebook.react.ReactActivity;
import android.os.Build;
import com.kitinventory.CustomClientFactory;  // replace <app-name>
import com.facebook.react.modules.network.OkHttpClientProvider;
import okhttp3.OkHttpClient;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "kitinventory";
  }

  @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {

            OkHttpClientProvider.setOkHttpClientFactory(new CustomClientFactory());
        }
    }
}
