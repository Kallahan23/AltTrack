from random import random
import requests
from plyer import notification
import kivy
from kivy.app import App
# from kivy.animation import Animation
# from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
# from kivy.uix.behaviors import ButtonBehavior
from kivy.graphics import Color, Rectangle
from kivy.clock import Clock
# from kivy.event import EventDispatcher
# from kivy.uix.gridlayout import GridLayout
from kivy.uix.floatlayout import FloatLayout
# from kivy.uix.image import Image
# from kivy.core.image import Image as CoreImage
from kivy.uix.label import Label
from kivy.properties import NumericProperty, ObjectProperty, ListProperty
# from kivy.uix.screenmanager import ScreenManager, Screen
# from kivy.core.audio import SoundLoader
# from kivy.vector import Vector
# from kivy.uix.widget import Widget
# from kivy.core.window import Window


"""Required Kivy version."""
kivy.require("1.9.1")

BASE_URL = "https://api.btcmarkets.net"
TICK_ETH = "/market/ETH/AUD/tick"


class MainFloat(FloatLayout):
    valuetxt = ObjectProperty(None)

    def __init__(self, **kwargs):
        super(MainFloat, self).__init__(**kwargs)
        Clock.schedule_interval(self.update, 10)

    def update(self, dt):
        self.valuetxt.update()

    def notify_me(self):
        notification.notify("AltTrack", "1 Eth = ${}".format(self.valuetxt.currentValue))


class ValueText(Label):
    currentValue = NumericProperty(0.0)
    tick = BASE_URL + TICK_ETH
    text_colour = ListProperty([1, 0, 0, 1])
    status = NumericProperty(0)

    def update(self):
        req = requests.get(self.tick)
        self.status = req.status_code
        if self.status == 200:
            self.currentValue = req.json()["lastPrice"]
            self.text_colour = [random() for i in range(3)] + [1]


class AltTrackApp(App):
    """Root Application Class."""

    def build(self):
        """Build app."""
        rootw = MainFloat()
        return rootw

    def on_pause(self):
        """Suspend app when moved to background."""
        return True

    def on_resume(self):
        """Resume app when moved back to foreground."""
        pass


if __name__ == "__main__":
    AltTrackApp().run()
