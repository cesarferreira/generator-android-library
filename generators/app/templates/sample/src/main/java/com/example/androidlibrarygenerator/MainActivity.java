package com.example.androidlibrarygenerator;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import com.example.library.Library;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void performClick(View view) {
        String message = Library.getInstance().getHello();

        Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
    }
}
